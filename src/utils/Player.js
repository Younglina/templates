import { Howl, Howler } from "howler";
import { getPlaylistDetail, intelligencePlaylist } from "@/api/playlist";
import { getLyric, getMP3, getTrackDetail, scrobble } from "@/api/track";
import { getAlbum } from "@/api/album";
import { isAccountLoggedIn } from "@/utils/auth";

const PLAY_PAUSE_FADE_DURATION = 200;
const INDEX_IN_PLAY_NEXT = -1;
const UNPLAYABLE_CONDITION = {
  PLAY_NEXT_TRACK: "playNextTrack",
  PLAY_PREV_TRACK: "playPrevTrack",
};
const excludeSaveKeys = [
  "_playing",
  "_personalFMLoading",
  "_personalFMNextLoading",
];
function setTitle(track) {
  const store = useMainStore();
  document.title = track
    ? `${track.name} · ${track.ar[0].name} - Vue3YesPlay`
    : "Vue3YesPlay";
  store.documentTitle = document.title;
}
export default class {
  constructor() {
    // 播放器状态
    this._playing = false; // 是否正在播放中
    this._progress = 0; // 当前播放歌曲的进度
    this._enabled = false; // 是否启用Player
    this._repeatMode = "off"; // off | on | one
    this._shuffle = false; // true | false
    this._reversed = false;
    this._volume = 1;
    this._volumeBeforeMuted = 1; // 用于保存静音前的音量

    // 播放信息
    this._list = []; // 播放列表
    this._playNextList = []; // 当这个list不为空时，会优先播放这个list的歌
    this._playlistSource = { type: "playlist", id: -1 }; // 当前播放列表的类型和id
    this._current = 0; // 当前播放歌曲在播放列表里的index
    this._currentTrack = { id: -1 }; // 当前播放歌曲的详细信息
    this.sourceBlobURL = "";
    this._isPersonalFM = false;

    // 全局howler对象
    this._howler = null;
    Object.defineProperty(this, "_howler", {
      enumerable: false,
    });

    this._init();
    window.vue3yesplay = {};
    window.vue3yesplay.player = this;
  }

  _init() {
    this._loadSelfFromLocalStorage();
    this._howler?.volume(this.volume);

    if (this._enabled && this._currentTrack) {
      // 恢复当前播放歌曲
      this._replaceCurrentTrack(this.currentTrackID, false).then(() => {
        this._howler?.seek(localStorage.getItem("playerCurrentTrackTime") ?? 0);
      }); // update audio source and init howler
      this._initMediaSession();
    }

    this._setIntervals();
  }

  _loadSelfFromLocalStorage() {
    const mainStore = JSON.parse(localStorage.getItem("mainStore"));
    if (!mainStore?.player) return;
    for (let [key, value] of Object.entries(mainStore.player)) {
      this[key] = value;
    }
  }

  _setIntervals() {
    // 同步播放进度
    // TODO: 如果 _progress 在别的地方被改变了，
    // 这个定时器会覆盖之前改变的值，是bug
    setInterval(() => {
      if (this._howler === null) return;
      this._progress = this._howler.seek();
      localStorage.setItem("playerCurrentTrackTime", this._progress);
    }, 1000);
  }
  /**
   * 替换播放列表
   *
   * @param {Array} trackIDs - 播放列表中的ID列表
   * @param {string} playlistSourceID - 播放列表源的ID
   * @param {string} playlistSourceType - 播放列表的来源类型，可以是'playlist'、'album'、'artist'、'url'、'cloudDisk'
   * @param {string} [autoPlayTrackID="first"] - 自动播放的音频ID，默认为'first'，表示播放列表中的第一条音频
   */
  replacePlaylist(
    trackIDs,
    playlistSourceID,
    playlistSourceType,
    autoPlayTrackID = "first"
  ) {
    this.list = trackIDs;
    this.current = 0;
    this._playlistSource = {
      type: playlistSourceType,
      id: playlistSourceID,
    };
    if (autoPlayTrackID === "first") {
      this._replaceCurrentTrack(this.list[0]);
    } else {
      this.current = trackIDs.indexOf(autoPlayTrackID);
      this._replaceCurrentTrack(autoPlayTrackID);
    }
  }
  /**
   * 替换当前播放音频
   *
   * @param {Array} id - 音频ID
   * @param {Boolean} autoplay - 是否自动播放
   * @param {string} [ifUnplayableThen="playNextTrack"]
   */
  _replaceCurrentTrack(
    id,
    autoplay = true,
    ifUnplayableThen = UNPLAYABLE_CONDITION.PLAY_PREV_TRACK
  ) {
    if (autoplay && this._currentTrack.name) {
      this._scrobble(this.currentTrack, this._howler?.seek());
    }
    return getTrackDetail(id).then((data) => {
      const track = data.songs[0];
      this._currentTrack = track;
      this._updateMediaSessionMetaData(track);
      return this._replaceCurrentTrackAudio(track, autoplay, ifUnplayableThen);
    });
  }

  pause() {
    this._howler?.fade(this.volume, 0, PLAY_PAUSE_FADE_DURATION);
    this._howler?.once("fade", () => {
      this._howler?.pause();
      this._playing = false;
      setTitle(null);
    });
  }

  play() {
    console.debug(`howler play`);
    if (this._howler?.playing()) return;

    this._howler?.play();
    this._howler?.once("play", () => {
      this._howler?.fade(0, this.volume, PLAY_PAUSE_FADE_DURATION);

      // 播放时确保开启player.
      // 避免因"忘记设置"导致在播放时播放器不显示的Bug
      this._enabled = true;
      this._playing = true;
      if (this._currentTrack.name) {
        setTitle(this._currentTrack);
      }
    });
  }

  seek(time = null) {
    if (time !== null) {
      this._howler?.seek(time);
    }
    return this._howler ? this._howler.seek() : 0;
  }

  playOrPause() {
    if (this._howler?.playing()) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * 先通过音频id在缓存中获取音频详情，没有再去请求接口
   *
   * @param {Object} track - 当前音频详细信息
   * @param {Boolean} autoplay - 是否自动播放
   * @param {Boolead} isCacheNextTrack - 是否提前缓存下一首音频
   * @param {Object} track - 当前音频详细信息
   * @returns 是否成功加载音频，并使用加载完成的音频替换了howler实例
   */
  _replaceCurrentTrackAudio(
    track,
    autoplay,
    ifUnplayableThen = UNPLAYABLE_CONDITION.PLAY_PREV_TRACK
  ) {
    return this._getAudioSourceFromNetease(track).then((source) => {
      if (source) {
        let replaced = false;
        if (track.id === this.currentTrackID) {
          this._playAudioSource(source, autoplay);
          replaced = true;
        }
        return replaced;
      } else {
        MessageBox({
          message: `无法播放 ${track.name}`,
        });
        switch (ifUnplayableThen) {
          case UNPLAYABLE_CONDITION.PLAY_NEXT_TRACK:
            this._playNextTrack(this.isPersonalFM);
            break;
          case UNPLAYABLE_CONDITION.PLAY_PREV_TRACK:
            this.playPrevTrack();
            break;
          default:
            MessageBox({
              message: "播放方式错误",
            });
            break;
        }
        return false;
      }
    });
  }
  _getAudioSourceBlobURL() {
    const source = URL.createObjectURL(new Blob([data]));
    URL.revokeObjectURL(this.sourceBlobURL);
    this.sourceBlobURL = source;
    return source;
  }
  _getAudioSourceFromNetease(track) {
    const mainStore = JSON.parse(localStorage.getItem("mainStore"));
    if (mainStore.baseData.user?.id && isAccountLoggedIn()) {
      return getMP3(track.id).then((result) => {
        if (!result.data[0]) return null;
        if (!result.data[0].url) return null;
        if (result.data[0].freeTrialInfo !== null) return null; // 跳过只能试听的歌曲
        const source = result.data[0].url.replace(/^http:/, "https:");
        return source;
      });
    } else {
      return new Promise((resolve) => {
        resolve(
          `https://music.163.com/song/media/outer/url?id=${track.id}.mp3`
        );
      });
    }
  }
  _playAudioSource(source, autoplay = true) {
    // 卸载所有当前加载的音频资源,释放内存和清理资源
    Howler.unload();
    // 初始化或者替换howler实例
    this._howler = new Howl({
      src: [source],
      html5: true, // 使用 HTML5 Audio API
      preload: true, // 预加载音频文件
      format: ["mp3", "flac"], // 支持的音频格式
      onend: () => {
        // 当音频播放结束时触发的回调函数
        this._nextTrackCallback();
      },
    });
    this._howler.on("loaderror", (_, errCode) => {
      // 尽管之前已确定可用，但在尝试解码媒体资源时发生错误，导致错误
      if (errCode === 3) {
        this._playNextTrack();
      } else if (errCode === 4) {
        // 发现关联的资源或媒体提供程序对象不合适
        MessageBox.close();
        MessageBox({
          message: "无法播放: 不支持的音频格式",
        });
        this._playNextTrack();
      } else {
        console.debug("loaderror");
        const t = this.progress;
        this._replaceCurrentTrackAudio(this.currentTrack, false).then(
          (replaced) => {
            // 如果 replaced 为 false，代表当前的 track 已经不是这里想要替换的track
            // 此时则不修改当前的歌曲进度
            if (replaced) {
              this._howler?.seek(t);
              this.play();
            }
          }
        );
      }
    });
    if (autoplay) {
      this.play();
      if (this._currentTrack.name) {
        setTitle(this._currentTrack);
      }
    }
  }
  _nextTrackCallback() {
    this._scrobble(this._currentTrack, 0, true);
    if (!this.isPersonalFM && this.repeatMode === "one") {
      this._replaceCurrentTrack(this.currentTrackID);
    } else {
      this._playNextTrack(this.isPersonalFM);
    }
  }

  _playNextTrack(isPersonal) {
    // if (isPersonal) {
    //   this.playNextFMTrack();
    // } else {
    this.playNextTrack();
    // }
  }
  playNextTrack() {
    const [trackID, index] = this._getNextTrack();
    if (trackID === undefined) {
      this._howler?.stop();
      this.playing = false;
      return false;
    }
    let next = index;
    if (index === INDEX_IN_PLAY_NEXT) {
      this._playNextList.shift();
      next = this.current;
    }
    this.current = next;
    this._replaceCurrentTrack(trackID);
    return true;
  }
  _getNextTrack() {
    const next = this._reversed ? this.current - 1 : this.current + 1;

    if (this._playNextList.length > 0) {
      let trackID = this._playNextList[0];
      return [trackID, INDEX_IN_PLAY_NEXT];
    }

    // 循环模式开启，则重新播放当前模式下的相对的下一首
    if (this.repeatMode === "on") {
      if (this._reversed && this.current === 0) {
        // 倒序模式，当前歌曲是第一首，则重新播放列表最后一首
        return [this.list[this.list.length - 1], this.list.length - 1];
      } else if (this.list.length === this.current + 1) {
        // 正序模式，当前歌曲是最后一首，则重新播放第一首
        return [this.list[0], 0];
      }
    }

    // 返回 [trackID, index]
    return [this.list[next], next];
  }

  playPrevTrack() {
    const [trackID, index] = this._getPrevTrack();
    if (trackID === undefined) return false;
    this.current = index;
    this._replaceCurrentTrack(
      trackID,
      true,
      UNPLAYABLE_CONDITION.PLAY_PREV_TRACK
    );
    return true;
  }
  playAlbumByID(id, trackID = "first") {
    getAlbum(id).then((data) => {
      let trackIDs = data.songs.map((t) => t.id);
      this.replacePlaylist(trackIDs, id, "album", trackID);
    });
  }
  playPlaylistByID(id, trackID = "first", noCache = false) {
    console.debug(
      `[debug][Player.js] playPlaylistByID 👉 id:${id} trackID:${trackID} noCache:${noCache}`
    );
    getPlaylistDetail(id, noCache).then((data) => {
      let trackIDs = data.playlist.trackIds.map((t) => t.id);
      this.replacePlaylist(trackIDs, id, "playlist", trackID);
    });
  }
  playArtistByID(id, trackID = "first") {
    getArtist(id).then((data) => {
      let trackIDs = data.hotSongs.map((t) => t.id);
      this.replacePlaylist(trackIDs, id, "artist", trackID);
    });
  }
  playTrackOnListByID(id, listName = "default") {
    if (listName === "default") {
      this._current = this._list.findIndex((t) => t === id);
    }
    this._replaceCurrentTrack(id);
  }
  addTrackToPlayNext(trackID, playNow = false) {
    this._playNextList.push(trackID);
    if (playNow) {
      this.playNextTrack();
    }
  }
  switchRepeatMode() {
    if (this._repeatMode === "on") {
      this.repeatMode = "one";
    } else if (this._repeatMode === "one") {
      this.repeatMode = "off";
    } else {
      this.repeatMode = "on";
    }
  }
  switchShuffle() {
    this.shuffle = !this.shuffle;
  }
  mute() {
    if (this.volume === 0) {
      this.volume = this._volumeBeforeMuted;
    } else {
      this._volumeBeforeMuted = this.volume;
      this.volume = 0;
    }
  }
  _getPrevTrack() {
    const next = this._reversed ? this.current + 1 : this.current - 1;

    // 循环模式开启，则重新播放当前模式下的相对的下一首
    if (this.repeatMode === "on") {
      if (this._reversed && this.current === 0) {
        // 倒序模式，当前歌曲是最后一首，则重新播放列表第一首
        return [this.list[0], 0];
      } else if (this.list.length === this.current + 1) {
        // 正序模式，当前歌曲是第一首，则重新播放列表最后一首
        return [this.list[this.list.length - 1], this.list.length - 1];
      }
    }

    // 返回 [trackID, index]
    return [this.list[next], next];
  }

  /**
   * 听歌打卡
   */
  async _scrobble(track, time, completed = false) {
    const trackDuration = ~~(track.dt / 1000);
    time = completed ? trackDuration : ~~time;
    scrobble({
      id: track.id,
      sourceid: this.playlistSource.id,
      time,
    });
  }

  /**
   * mediaSession 是一个浏览器提供的 API，用于控制媒体元数据和媒体控件的行为。
   * 它允许开发者在网页中定义媒体元数据（如标题、艺术家、专辑封面等），并控制媒体控件的行为（如播放、暂停、跳转等）。
   */
  _updateMediaSessionMetaData(track) {
    if ("mediaSession" in navigator === false || !track) {
      return;
    }
    let artists = track.ar.map((a) => a.name);
    const metadata = {
      title: track.name,
      artist: artists.join(","),
      album: track.al.name,
      artwork: [
        {
          src: track.al.picUrl + "?param=224y224",
          type: "image/jpg",
          sizes: "224x224",
        },
        {
          src: track.al.picUrl + "?param=512y512",
          type: "image/jpg",
          sizes: "512x512",
        },
      ],
      length: this.currentTrackDuration,
      trackId: this.current,
      url: "/trackid/" + track.id,
    };

    navigator.mediaSession.metadata = new window.MediaMetadata(metadata);
  }
  _initMediaSession() {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", () => {
        this.play();
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        this.pause();
      });
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        this.playPrevTrack();
      });
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        this._playNextTrack(this.isPersonalFM);
      });
      navigator.mediaSession.setActionHandler("stop", () => {
        this.pause();
      });
      navigator.mediaSession.setActionHandler("seekto", (event) => {
        this.seek(event.seekTime);
        this._updateMediaSessionPositionState();
      });
      navigator.mediaSession.setActionHandler("seekbackward", (event) => {
        this.seek(this.seek() - (event.seekOffset || 10));
        this._updateMediaSessionPositionState();
      });
      navigator.mediaSession.setActionHandler("seekforward", (event) => {
        this.seek(this.seek() + (event.seekOffset || 10));
        this._updateMediaSessionPositionState();
      });
    }
  }

  saveSelfToLocalStorage() {
    let player = {};
    for (let [key, value] of Object.entries(this)) {
      if (excludeSaveKeys.includes(key)) continue;
      player[key] = value;
    }

    localStorage.setItem("player", JSON.stringify(player));
  }

  get list() {
    return this._list;
  }
  set list(list) {
    this._list = list;
  }
  get volume() {
    return this._volume;
  }
  set volume(volume) {
    this._volume = volume;
    this._howler?.volume(volume);
  }
  get isPersonalFM() {
    return this._isPersonalFM;
  }
  get repeatMode() {
    return this._repeatMode;
  }
  set repeatMode(mode) {
    if (this._isPersonalFM) return;
    if (!["off", "on", "one"].includes(mode)) {
      console.warn("repeatMode: must be 'on' | 'off' | 'one'");
      return;
    }
    this._repeatMode = mode;
  }

  get playNextList() {
    return this._playNextList;
  }
  get playing() {
    return this._playing;
  }
  set playing(value) {
    return (this._playing = value);
  }
  get progress() {
    return this._progress;
  }
  set progress(value) {
    if (this._howler) {
      this._howler.seek(value);
    }
  }
  get playlistSource() {
    return this._playlistSource;
  }
  get current() {
    return this._current;
  }
  set current(current) {
    this._current = current;
  }
  get currentTrack() {
    return this._currentTrack || {};
  }
  get currentTrackID() {
    return this._currentTrack?.id ?? 0;
  }
  get currentTrackDuration() {
    const trackDuration = this._currentTrack?.dt || 1000;
    let duration = ~~(trackDuration / 1000);
    return duration > 1 ? duration - 1 : duration;
  }
  get enabled() {
    return this._enabled;
  }
}

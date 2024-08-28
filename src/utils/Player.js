import { Howl, Howler } from "howler";
import { getLyric, getMP3, getTrackDetail, scrobble } from "@/api/track";
import { getTrackSource } from "./db.js";
import { isAccountLoggedIn } from "@/utils/auth";

const INDEX_IN_PLAY_NEXT = -1;
const UNPLAYABLE_CONDITION = {
  PLAY_NEXT_TRACK: "playNextTrack",
  PLAY_PREV_TRACK: "playPrevTrack",
};
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

    // 播放信息
    this._list = []; // 播放列表
    this._playNextList = []; // 当这个list不为空时，会优先播放这个list的歌
    this._playlistSource = { type: "playlist", id: -1 }; // 当前播放列表的类型和id
    this._current = 0; // 当前播放歌曲在播放列表里的index
    this._currentTrack = {
      name: "无名的人 (live)",
      id: 2108827013,
      pst: 0,
      t: 0,
      ar: [
        { id: 4941, name: "孙楠", tns: [], alias: [] },
        { id: 2124, name: "陈楚生", tns: [], alias: [] },
      ],
      alia: [],
      pop: 100,
      st: 0,
      rt: "",
      fee: 8,
      v: 9,
      crbt: null,
      cf: "",
      al: {
        id: 181191266,
        name: "声生不息·家年华 第3期",
        picUrl:
          "https://p1.music.126.net/uO70pUEpTU72gfagRUP5oA==/109951169560298051.jpg",
        tns: [],
        pic_str: "109951169560298051",
        pic: 109951169560298050,
      },
      dt: 320810,
      h: { br: 320000, fid: 0, size: 12835245, vd: -42153, sr: 48000 },
      m: { br: 192000, fid: 0, size: 7701165, vd: -39586, sr: 48000 },
      l: { br: 128000, fid: 0, size: 5134125, vd: -37946, sr: 48000 },
      sq: { br: 879542, fid: 0, size: 35270822, vd: -42534, sr: 48000 },
      hr: { br: 1648745, fid: 0, size: 66116879, vd: -42130, sr: 48000 },
      a: null,
      cd: "01",
      no: 2,
      rtUrl: null,
      ftype: 0,
      rtUrls: [],
      djId: 0,
      copyright: 1,
      s_id: 0,
      mark: 17716748288,
      originCoverType: 2,
      originSongSimpleData: null,
      tagPicList: null,
      resourceState: true,
      version: 9,
      songJumpInfo: null,
      entertainmentTags: null,
      awardTags: null,
      single: 0,
      noCopyrightRcmd: null,
      mv: 0,
      mst: 9,
      cp: 7001,
      rtype: 0,
      rurl: null,
      publishTime: 1702656000000,
      privilege: {
        id: 2108827013,
        fee: 8,
        payed: 0,
        st: 0,
        pl: 128000,
        dl: 0,
        sp: 7,
        cp: 1,
        subp: 1,
        cs: false,
        maxbr: 999000,
        fl: 320000,
        toast: false,
        flag: 260,
        preSell: false,
        playMaxbr: 999000,
        downloadMaxbr: 999000,
        maxBrLevel: "hires",
        playMaxBrLevel: "hires",
        downloadMaxBrLevel: "hires",
        plLevel: "standard",
        dlLevel: "none",
        flLevel: "exhigh",
        rscl: null,
        freeTrialPrivilege: {
          resConsumable: false,
          userConsumable: false,
          listenType: null,
          cannotListenReason: null,
          playReason: null,
          freeLimitTagType: null,
        },
        rightSource: 0,
        chargeInfoList: [
          {
            rate: 128000,
            chargeUrl: null,
            chargeMessage: null,
            chargeType: 0,
          },
          {
            rate: 192000,
            chargeUrl: null,
            chargeMessage: null,
            chargeType: 0,
          },
          {
            rate: 320000,
            chargeUrl: null,
            chargeMessage: null,
            chargeType: 0,
          },
          {
            rate: 999000,
            chargeUrl: null,
            chargeMessage: null,
            chargeType: 1,
          },
          {
            rate: 1999000,
            chargeUrl: null,
            chargeMessage: null,
            chargeType: 1,
          },
        ],
        code: 0,
        message: null,
      },
      playable: true,
      reason: "",
    }; // 当前播放歌曲的详细信息
    this.sourceBlobURL = "";
    this._isPersonalFM = false;

    // 全局howler对象
    this._howler = null;
    Object.defineProperty(this, "_howler", {
      enumerable: false,
    });
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
    ifUnplayableThen = "playNextTrack"
  ) {
    if (autoplay && this._currentTrack.name) {
      this._scrobble(this.currentTrack, this._howler?.seek());
    }
    return getTrackDetail(id).then((data) => {
      const track = data.songs[0];
      this._currentTrack = track;
      this._updateMediaSessionMetaData(track);
      return this._replaceCurrentTrackAudio(
        track,
        autoplay,
        true,
        ifUnplayableThen
      );
    });
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
    isCacheNextTrack,
    ifUnplayableThen = "playNextTrack"
  ) {
    return this._getAudioSource(track).then((source) => {
      if (source) {
        let replaced = false;
        if (track.id === this.currentTrackID) {
          this._playAudioSource(source, autoplay);
          replaced = true;
        }
        if (isCacheNextTrack) {
          this._cacheNextTrack();
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
  /**
   * 获取音频源
   * @param {*} track
   */
  _getAudioSource(track) {
    return this._getAudioSourceFromCache(String(track.id)).then((source) => {
      return source ?? this._getAudioSourceFromNetease(track);
    });
  }
  _getAudioSourceFromCache(id) {
    return getTrackSource(id).then((t) => {
      if (!t) return null;
      return this._getAudioSourceBlobURL(t.source);
    });
  }
  _getAudioSourceBlobURL() {
    const source = URL.createObjectURL(new Blob([data]));
    URL.revokeObjectURL(this.sourceBlobURL);
    this.sourceBlobURL = source;
    return source;
  }
  _getAudioSourceFromNetease(track) {
    if (isAccountLoggedIn()) {
      return getMP3(track.id).then((result) => {
        if (!result.data[0]) return null;
        if (!result.data[0].url) return null;
        if (result.data[0].freeTrialInfo !== null) return null; // 跳过只能试听的歌曲
        const source = result.data[0].url.replace(/^http:/, "https:");
        return source;
      });
    } else {
      return new Promise((resolve) => {
        resolve(`https://music.163.com/song/media/outer/url?id=${track.id}`);
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
        MessageBox({
          message: "无法播放: 不支持的音频格式",
        });
        this._playNextTrack();
      } else {
        const t = this.progress;
        this._replaceCurrentTrackAudio(this.currentTrack, false, false).then(
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
  _cacheNextTrack() {
    let nextTrackID = this._getNextTrack()[0];
    if (!nextTrackID) return;
    getTrackDetail(nextTrackID).then((data) => {
      let track = data.songs[0];
      this._getAudioSource(track);
    });
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
   * mediaSession 是一个浏览器提供的 API，用于控制媒体元数据和媒体控件的行为。
   * 它允许开发者在网页中定义媒体元数据（如标题、艺术家、专辑封面等），并控制媒体控件的行为（如播放、暂停、跳转等）。
   */
  _updateMediaSessionMetaData(track) {
    if ("mediaSession" in navigator === false) {
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

  get list() {
    return this._list;
  }
  set list(list) {
    this._list = list;
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
    return this._currentTrack;
  }
  get currentTrackID() {
    return this._currentTrack?.id ?? 0;
  }
  get currentTrackDuration() {
    const trackDuration = this._currentTrack.dt || 1000;
    let duration = ~~(trackDuration / 1000);
    return duration > 1 ? duration - 1 : duration;
  }
}

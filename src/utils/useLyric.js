import { lyricParser } from "@/utils/lyrics";
import { getLyric } from "@/api/track";
export default function useLyric() {
  // 歌词、翻译、罗马音
  let _lyric = [],
    _tlyric = [],
    _romalyric = [];
  const lyricType = ref("translation");

  const lyrics = ref([]);
  const noLyric = ref(true);
  const highlightLyricIndex = ref(0);
  const isShowLyricTypeSwitch = ref(false);
  async function getLyrics(currentTrack = {}) {
    if (!currentTrack.id) return;
    const data = await getLyric(currentTrack.id);
    if (!data?.lrc?.lyric) {
      _lyric = [];
      _tlyric = [];
      _romalyric = [];
    } else {
      let { lyric, tlyric, romalyric } = lyricParser(data);
      lyric = lyric.filter((l) => !/^作(词|曲)\s*(:|：)\s*无$/.exec(l.content));
      let includeAM =
        lyric.length <= 10 &&
        lyric.map((l) => l.content).includes("纯音乐，请欣赏");
      if (includeAM) {
        let reg = /^作(词|曲)\s*(:|：)\s*/;
        let author = currentTrack?.ar[0]?.name;
        lyric = lyric.filter((l) => {
          let regExpArr = l.content.match(reg);
          return !regExpArr || l.content.replace(regExpArr[0], "") !== author;
        });
      }
      if (lyric.length === 1 && includeAM) {
        _lyric = [];
        _tlyric = [];
        _romalyric = [];
      } else {
        _lyric = lyric;
        _tlyric = tlyric;
        _romalyric = romalyric;
        if (tlyric.length * romalyric.length > 0) {
          lyricType.value = "translation";
        } else {
          lyricType.value =
            lyric.length > 0 ? "translation" : "romaPronunciation";
        }
      }
    }
    lyrics.value = lyricToShow();
    noLyric.value = !_lyric.length;
    isShowLyricTypeSwitch.value = _romalyric.length > 0 && _tlyric.length > 0;
  }

  function lyricToShow() {
    let ret = [];
    // 空内容的去除
    const lyricFiltered = _lyric.filter(({ content }) => Boolean(content));
    // content统一转换数组形式
    if (lyricFiltered.length) {
      lyricFiltered.forEach((l) => {
        const { rawTime, time, content } = l;
        const lyricItem = { time, content, contents: [content] };
        const lyrics = lyricType.value === "translation" ? _tlyric : _romalyric;
        const sameTimeTLyric = lyrics.find(({ rawTime: tLyricRawTime }) => {
          return (
            tLyricRawTime === rawTime ||
            tLyricRawTime.slice(0, -1).startsWith(rawTime.slice(0, -1))
          );
        });
        if (sameTimeTLyric) {
          const { content: tLyricContent } = sameTimeTLyric;
          if (content) {
            lyricItem.contents.push(tLyricContent);
          }
        }
        ret.push(lyricItem);
      });
    } else {
      ret = lyricFiltered.map(({ time, content }) => ({
        time,
        content,
        contents: [content],
      }));
    }
    return ret;
  }

  function switchLyricType() {
    lyricType.value =
      lyricType.value === "translation" ? "romaPronunciation" : "translation";
    lyrics.value = lyricToShow();
  }

  let clickLineTimer = null;
  function clickLyricLine(value, startPlay = false) {
    let jumpFlag = false;
    const store = useMainStore();
    lyrics.value.filter(function (item) {
      if (item.content == "纯音乐，请欣赏") {
        jumpFlag = true;
      }
    });
    if (!jumpFlag) {
      clickLineTimer = setTimeout(() => {
        store.player.seek(value);
        clearTimeout(clickLineTimer);
        clickLineTimer = null;
      }, 100);
    }
    if (startPlay === true) {
      // player.play();
      clearTimeout(clickLineTimer);
      clickLineTimer = null;
    }
  }

  let lyricsInterval = null;
  const curShowProgress = ref(0);
  function setLyricsInterval() {
    const store = useMainStore();
    lyricsInterval = setInterval(() => {
      const progress = store.player.seek(null, false) ?? 0;
      store.player.progress = progress;
      let oldHighlightLyricIndex = highlightLyricIndex.value;
      highlightLyricIndex.value = lyrics.value.findIndex((l, index) => {
        const nextLyric = lyrics.value[index + 1];
        return (
          progress >= l.time && (nextLyric ? progress < nextLyric.time : true)
        );
      });
      if (oldHighlightLyricIndex !== highlightLyricIndex.value) {
        const el = document.getElementById(`line${highlightLyricIndex.value}`);
        if (el)
          el.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
      }
    }, 50);
    store.enableScrolling = false;
  }
  function clearLyricsInterval() {
    const store = useMainStore();
    clearInterval(lyricsInterval);
    lyricsInterval = null;
    store.enableScrolling = true;
  }

  return {
    getLyrics,
    switchLyricType,
    clickLyricLine,
    setLyricsInterval,
    clearLyricsInterval,
    lyrics,
    noLyric,
    lyricType,
    isShowLyricTypeSwitch,
    highlightLyricIndex,
    curShowProgress,
  };
}

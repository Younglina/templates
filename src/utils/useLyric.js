import { lyricParser } from "@/utils/lyrics";
import { getLyric } from "@/api/track";
import { computed } from "vue";

export default function useLyric(currentTrack) {
  // 歌词、翻译、罗马音
  let _lyric = [],
    _tlyric = [],
    _romalyric = [];
  const lyricType = ref("translation");
  if (!currentTrack.id) return;

  const lyrics = ref([]);
  const noLyric = ref(true);
  async function getLyrics() {
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
        const sameTimeTLyric = lyrics.find(
          ({ rawTime: tLyricRawTime }) => tLyricRawTime === rawTime
        );
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
  }

  const isShowLyricTypeSwitch = computed(() => {
    return _romalyric.length > 0 && _tlyric.length > 0;
  });
  return {
    getLyrics,
    lyrics,
    noLyric,
    switchLyricType,
    lyricType,
    isShowLyricTypeSwitch,
  };
}

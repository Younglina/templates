import { reactive, toRaw, watch } from 'vue'

const _vue3yesplay = reactive({
  album: new Map(),
  lyric: new Map(),
  trackDetail: {},
})

export function initDB() {
  // watch([()=>_vue3yesplay.album, () => _vue3yesplay.lyric, () => _vue3yesplay.trackDetail],
  // ([album, lyric, trackDetail])=>{
  //   const rawVue3yesplay = toRaw(_vue3yesplay)
  //   console.log(album, lyric, trackDetail, rawVue3yesplay)
  // },{ deep: true })
  const localVue3yesplay = JSON.parse(localStorage.getItem('VUE3YESPLAY'))
  if (localVue3yesplay) {
    _vue3yesplay.album = new Map(localVue3yesplay.album)
    _vue3yesplay.lyric = new Map(localVue3yesplay.lyric)
    localVue3yesplay.trackDetail.map((item) => {
      _vue3yesplay.trackDetail[item.id] = item
    })
  }
  watch(_vue3yesplay, (obj) => {
    const rawObj = toRaw(obj)
    rawObj.album = Array.from(rawObj.album.entries())
    rawObj.lyric = Array.from(rawObj.lyric.entries())
    rawObj.trackDetail = Object.values(rawObj.trackDetail)
    window.localStorage.setItem('VUE3YESPLAY', JSON.stringify(rawObj))
  })
}

function p(res) {
  return Promise.resolve(res)
}

export function cacheLyric(id, lyrics) {
  _vue3yesplay.lyric.set(id, {
    id,
    lyrics,
    updateTime: new Date().getTime(),
  })
}

export function getLyricFromCache(id) {
  return p(_vue3yesplay.lyric.get(Number(id))?.lyrics)
}
export function cacheAlbum(id, album) {
  _vue3yesplay.album.set(Number(id), {
    id: Number(id),
    album,
    updateTime: new Date().getTime(),
  })
}

export function getAlbumFromCache(id) {
  return p(_vue3yesplay.album.get(Number(id))?.album)
}

export function cacheTrackDetail(track) {
  _vue3yesplay.trackDetail = { ..._vue3yesplay.trackDetail, ...track }
}

export function getTrackDetailFromCache(ids) {
  let result = { songs: [], privileges: [] }
  ids.map((id) => {
    const one = _vue3yesplay.trackDetail[id]
    result.songs.push(one?.detail)
    result.privileges.push(one?.privileges)
  })
  if (result.songs.includes(undefined)) {
    result = undefined
  }
  return p(result)
}

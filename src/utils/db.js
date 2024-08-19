export function initDB() {
  const vue3yesplay = window.localStorage.getItem("VUE3YESPLAY");
  if (!vue3yesplay) {
    window.localStorage.setItem(
      "VUE3YESPLAY",
      JSON.stringify({
        album: { type: "map", value: "[]" },
        lyric: { type: "map", value: "[]" },
        trackDetail: { value: "[]" },
      })
    );
  }
}

function getDB(key) {
  const vue3yesplay = window.localStorage.getItem("VUE3YESPLAY") || {};
  const db = JSON.parse(vue3yesplay)[key];
  let value = JSON.parse(db.value);
  if (db.type === "map") {
    value = new Map(value);
  }
  return value;
}

function p(res) {
  return Promise.resolve(res);
}

export function cacheLyric(id, lyrics) {
  getDB("lyric").set(id, {
    id,
    lyrics,
    updateTime: new Date().getTime(),
  });
}

export function getLyricFromCache(id) {
  return p(getDB("lyric").get(Number(id))?.lyrics);
}
export function cacheAlbum(id, album) {
  getDB("album").set(Number(id), {
    id: Number(id),
    album,
    updateTime: new Date().getTime(),
  });
}

export function getAlbumFromCache(id) {
  return p(getDB("album").get(Number(id))?.album);
}

export function cacheTrackDetail(track, privileges) {
  getDB("trackDetail").push({
    id: track.id,
    detail: track,
    privileges: privileges,
    updateTime: new Date().getTime(),
  });
}

export function getTrackDetailFromCache(ids) {
  const tracks = getDB("trackDetail").filter((track) => {
    return ids.includes(String(track.id));
  });
  const result = { songs: [], privileges: [] };
  ids.map((id) => {
    const one = tracks.find((t) => String(t.id) === id);
    result.songs.push(one?.detail);
    result.privileges.push(one?.privileges);
  });
  if (result.songs.includes(undefined)) {
    return undefined;
  }
  return p(result);
}

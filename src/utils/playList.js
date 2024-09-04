import { useMainStore } from "@/store";
import { dailyRecommendPlaylist, recommendPlaylist } from "@/api/playlist";
import { isAccountLoggedIn } from "@/utils/auth";
const router = useRouter();

export function hasListSource() {
  const store = useMainStore();
  return !store.player.isPersonalFM && store.player.playlistSource.id !== 0;
}

export function goToListSource() {
  router.push({ path: getListSourcePath() });
}

export function getListSourcePath() {
  const store = useMainStore();
  if (store.player.playlistSource.id === store.data.likedSongPlaylistID) {
    return "/library/liked-songs";
  } else if (store.player.playlistSource.type === "url") {
    return store.player.playlistSource.id;
  } else if (store.player.playlistSource.type === "cloudDisk") {
    return "/library";
  } else {
    return `/${store.player.playlistSource.type}/${store.player.playlistSource.id}`;
  }
}

export async function getRecommendPlayList(limit, removePrivateRecommand) {
  if (isAccountLoggedIn()) {
    const playlists = await Promise.all([
      dailyRecommendPlaylist(),
      recommendPlaylist({ limit }),
    ]);
    let recommend = [];
    if (playlists[0].recommend) {
      recommend = playlists[0].recommend.map((item) => {
        item.playCount = item.playcount;
        return item;
      });
    }
    return recommend.concat(playlists[1].result).slice(0, limit);
  } else {
    const response = await recommendPlaylist({ limit });
    return response.result;
  }
}

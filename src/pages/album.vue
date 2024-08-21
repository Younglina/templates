<script setup>
import { getAlbum, albumDynamicDetail, likeAAlbum } from "@/api/album";
import { getArtistAlbum } from "@/api/artist";
import { getTrackDetail } from "@/api/track";
import { formatDate, formatTime } from "@/utils/common";

const route = useRoute();
const { showPg, startPg, donePg } = useProgres();
const store = useMainStore();

const mData = reactive({
  show: false,
  tracks: [],
  lastLoadedTrackIndex: 0,
  hasMore: true,
});
onMounted(() => {
  if (route.name === "likedSongs") {
    loadData(mData.likedSongalbumID);
  } else {
    loadData(route.params.id);
  }
  startPg();
});

const album = shallowRef({ artist: {} });
const tracks = shallowRef([]);
const _moreAlbums = shallowRef([]);
function loadData(id) {
  getAlbum(id).then((data) => {
    album.value = data.album;
    donePg();

    let trackIDs = data.songs.map((t) => t.id);
    getTrackDetail(trackIDs.join(",")).then((data) => {
      tracks.value = data.songs;
    });

    getArtistAlbum({ id: data.album.artist.id, limit: 100 }).then((data) => {
      _moreAlbums.value = data.hotAlbums;
    });
  });
}
const filteredMoreAlbums = computed(() => {
  let moreAlbums = _moreAlbums.value.filter((a) => a.id !== album.value.id);
  let realAlbums = moreAlbums.filter((a) => a.type === "专辑");
  let eps = moreAlbums.filter(
    (a) => a.type === "EP" || (a.type === "EP/Single" && a.size > 1)
  );
  let restItems = moreAlbums.filter(
    (a) =>
      realAlbums.find((a1) => a1.id === a.id) === undefined &&
      eps.find((a1) => a1.id === a.id) === undefined
  );
  if (realAlbums.length === 0) {
    return [...realAlbums, ...eps, ...restItems].slice(0, 5);
  } else {
    return [...realAlbums, ...restItems].slice(0, 5);
  }
});
const albumTime = computed(() => {
  let time = 0;
  tracks.value.map((t) => (time = time + t.dt));
  return time;
});
function toggleFullDescription() {
  MessageBox({
    title: "专辑详情",
    message: album.value.description,
  });
}
// todo
function playalbumByID() {}
function likealbum() {}
function openMenu() {}
</script>

<template>
  <div v-show="showPg" class="mt-32px">
    <div class="list-info">
      <Cover
        :id="album.id"
        :image-url="`${album.picUrl}?param=1024y1024`"
        :fixed-size="288"
        click-cover-to-play
        always-show-shadow
        type="album"
      />
      <div class="info">
        <div class="list-title" @click.right="openMenu">
          <div v-if="album.privacy === 10" class="lock-icon" />
          {{ album.name }}
        </div>
        <div class="artist">
          Album by
          <a :href="`/music/artist/${album.artist.id}`" target="blank"
            >{{ album.artist.name }}
          </a>
        </div>
        <div class="date-and-count">
          {{ formatDate(album.publishTime, "YYYY") }} ·
          {{ tracks.length }} 首歌，{{ formatTime(albumTime, "Human") }}
        </div>
        <div class="description" @click="toggleFullDescription">
          {{ album.description }}
        </div>
        <div class="buttons">
          <ButtonIcon class="play-button" grey @click.native="playalbumByID()">
            <div class="i-material-symbols-play-arrow-rounded size-26px" />
            播放
          </ButtonIcon>
          <ButtonIcon
            v-if="album.artist.id !== store.baseData.user.userId"
            grey
            @click.native="likealbum"
          >
            <div
              :class="[
                album.subscribed
                  ? 'i-material-symbols-favorite-rounded'
                  : 'i-material-symbols-favorite-outline-rounded',
                album.subscribed ? 'c-#335eea' : '',
              ]"
              :style="{
                backgroundColor: album.subscribed
                  ? 'var(--color-secondary-bg)'
                  : '',
              }"
            />
          </ButtonIcon>
          <ButtonIcon grey @click.native="openMenu">
            <div class="i-material-symbols-more-horiz" />
          </ButtonIcon>
        </div>
      </div>
    </div>

    <TrackList :id="album.id" :data-list="tracks" type="album" />
    <div class="extra-info">
      <p class="release-date">发行于{{ formatDate(album.publishTime) }}</p>
      <p v-if="album.company" class="copyright">© {{ album.company }}</p>
    </div>
    <div v-if="filteredMoreAlbums.length !== 0" class="more-by">
      <div class="section-title">
        More by
        <router-link :to="`/artist/${album.artist.id}`"
          >{{ album.artist.name }}
        </router-link>
      </div>
      <div>
        <CoverRow
          type="album"
          :dataList="filteredMoreAlbums"
          sub-text="albumType+releaseYear"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.list-info {
  display: flex;
  margin-bottom: 72px;
  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    margin-left: 56px;
    .list-title {
      font-size: 56px;
      font-weight: 700;
      color: var(--color-text);
    }
    .artist {
      font-size: 18px;
      color: var(--color-text);
      margin-top: 24px;
    }
    .date-and-count {
      font-size: 14px;
      opacity: 0.88;
      color: var(--color-text);
      margin-top: 2px;
    }
    .description {
      user-select: none;
      font-size: 14px;
      opacity: 0.68;
      margin-top: 24px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      cursor: pointer;
      white-space: pre-line;
      &:hover {
        transition: opacity 0.3s;
        opacity: 0.88;
      }
    }
  }
  .buttons {
    display: flex;
    margin-top: 32px;
    .button-icon {
      font-size: 16px;
      margin-right: 16px;
      margin-left: 0px;
    }
    .play-button {
      color: var(--color-primary);
      padding: 8px 12px 8px 8px;
      background-color: var(--color-primary-bg);
    }
  }
}
.extra-info {
  margin-top: 36px;
  margin-bottom: 36px;
  font-size: 12px;
  opacity: 0.48;
  color: var(--color-text);
  div {
    margin-bottom: 4px;
  }
}
.more-by {
  border-top: 1px solid rgba(128, 128, 128, 0.18);

  padding-top: 22px;
  .section-title {
    font-size: 22px;
    font-weight: 600;
    opacity: 0.88;
    color: var(--color-text);
    margin-bottom: 20px;
  }
}
</style>

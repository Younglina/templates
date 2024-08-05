<script setup>
import {
  getArtist,
  getArtistAlbum,
  artistMv,
  followAArtist,
  similarArtists,
} from "@/api/artist";
import { getTrackDetail } from "@/api/track";

const { showPg, startPg, donePg } = useProgres();
const artist = ref({});
const dSimilarArtists = ref([]);

function loadData(id) {
  startPg();
  showPg.value = false;
  // this.$parent.$refs.main.scrollTo({ top: 0 });
  getArtist(id).then((data) => {
    artist.value = data.artist;
    setPopularTracks(data.hotSongs);
    donePg();
    showPg.value = true;
  });
  initArtistAlbum(id);
  initMvs(id);
  similarArtists(id).then((data) => {
    dSimilarArtists.value = data.artists;
  });
}

// 专辑相关
const latestRelease = ref({});
const albums = ref([]);
const showMoreAlbums = ref(false);
const eps = ref([]);
const showMoreEps = ref(false);
function initArtistAlbum(id) {
  getArtistAlbum({ id: id, limit: 200 }).then((data) => {
    const albumsData = data.hotAlbums;
    albums.value = albumsData.filter(
      (a) => a.type === "专辑" || a.type === "精选集"
    );
    eps.value = albumsData.filter((a) =>
      ["EP/Single", "EP", "Single"].includes(a.type)
    );
    latestRelease.value = data.hotAlbums[0];
  });
}

// 热门歌曲
const popularTracks = ref([]);
const showMorePopTracks = ref(false);
function setPopularTracks(hotSongs) {
  const trackIDs = hotSongs.map((t) => t.id);
  getTrackDetail(trackIDs.join(",")).then((data) => {
    popularTracks.value.push(...data.songs);
  });
}

//  mv相关
const mvs = ref([]);
const hasMoreMV = ref(false);
function initMvs(id) {
  artistMv({ id }).then((data) => {
    mvs.value = data.mvs;
    hasMoreMV.value = data.hasMore;
  });
}
function scrollTo(div, block = "center") {
  document.getElementById(div).scrollIntoView({
    behavior: "smooth",
    block,
  });
}
function toggleFullDescription() {}
const route = useRoute();
onActivated(() => {
  loadData(route.params.id);
});
</script>
<template>
  <div v-show="showPg" class="artist-page">
    <div class="artist-info">
      <div
        class="head"
        :style="{
          backgroundImage: `url(${artist.img1v1Url + '?param=1024y1024'})`,
        }"
      ></div>
      <div>
        <div class="name">{{ artist.name }}</div>
        <div class="artist">艺人</div>
        <div class="statistics">
          <a @click="scrollTo('popularTracks')">{{ artist.musicSize }} 首歌</a>
          ·
          <a @click="scrollTo('seeMore', 'start')"
            >{{ artist.albumSize }} 张专辑</a
          >
          ·
          <a @click="scrollTo('mvs')">{{ artist.mvSize }} 个MV</a>
        </div>
        <div class="description" @click="toggleFullDescription">
          {{ artist.briefDesc }}
        </div>
      </div>
    </div>
    <div id="popularTracks" class="popular-tracks">
      <div class="section-title">热门歌曲</div>
      <TrackList
        :tracks="popularTracks.slice(0, showMorePopTracks ? 24 : 12)"
        :type="'tracklist'"
      />

      <div id="seeMore" class="show-more">
        <button @click="showMorePopTracks = !showMorePopTracks">
          <span>{{ !showMorePopTracks ? "显示更多" : "收起" }}</span>
        </button>
      </div>
    </div>
    <div v-if="albums.length !== 0" id="albums" class="albums">
      <div class="section-title">专辑</div>
      <CoverRow
        :type="'album'"
        :items="albums.slice(0, showMoreAlbums ? albums.length : 15)"
        :sub-text="'releaseYear'"
        :show-play-button="true"
      />
      <div id="seeMore" class="show-more">
        <button @click="showMoreAlbums = !showMoreAlbums">
          <span>{{ !showMoreAlbums ? "显示更多" : "收起" }}</span>
        </button>
      </div>
    </div>

    <div v-if="mvs.length !== 0" id="mvs" class="mvs">
      <div class="section-title">
        MVs
        <router-link v-show="hasMoreMV" :to="`/artist/${artist.id}/mv`"
          >查看全部</router-link
        >
      </div>
      <MvList :mvs="mvs" subtitle="publishTime" />
    </div>

    <div v-if="eps.length !== 0" class="eps">
      <div class="section-title">EP 和单曲</div>
      <CoverRow
        :type="'album'"
        :items="eps.slice(0, showMoreEps ? eps.length : 15)"
        :sub-text="'albumType+releaseYear'"
        :show-play-button="true"
      />
      <div id="seeMore" class="show-more">
        <button @click="showMoreEps = !showMoreEps">
          <span>{{ !showMoreEps ? "显示更多" : "收起" }}</span>
        </button>
      </div>
    </div>
    <div v-if="dSimilarArtists.length !== 0" class="similar-artists">
      <div class="section-title">相似艺人</div>
      <CoverRow
        type="artist"
        :column-number="6"
        gap="36px 28px"
        :items="dSimilarArtists.slice(0, 12)"
      />
    </div>
  </div>
</template>
<style scoped lang="scss">
.artist-page {
  margin-top: 32px;
}

.artist-info {
  display: flex;
  align-items: center;
  margin-bottom: 26px;
  color: var(--color-text);
  .head {
    min-height: 248px;
    min-width: 248px;
    border-radius: 50%;
    margin-right: 56px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 16px -8px;
    background-size: 100% 100%;
    background-position: center center;
    background-repeat: no-repeat;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      top: 5%;
      left: 0%;
      width: 100%;
      height: 100%;
      background: inherit;
      background-size: 100% 100%;
      border-radius: 50%;
      transform: scale(0.95);
      filter: blur(10px) brightness(80%) opacity(0.8);
      z-index: -1;
    }
  }
  .name {
    font-size: 56px;
    font-weight: 700;
  }

  .artist {
    font-size: 18px;
    opacity: 0.88;
    margin-top: 24px;
  }
  .statistics {
    font-size: 14px;
    opacity: 0.68;
    margin-top: 2px;
  }
  .description {
    user-select: none;
    font-size: 14px;
    opacity: 0.68;
    margin-top: 24px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    cursor: pointer;
    white-space: pre-line;
    &:hover {
      transition: opacity 0.3s;
      opacity: 0.88;
    }
  }
}
.section-title {
  font-weight: 600;
  font-size: 22px;
  opacity: 0.88;
  color: var(--color-text);
  margin-bottom: 16px;
  padding-top: 46px;

  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  a {
    font-size: 13px;
    font-weight: 600;
    opacity: 0.68;
  }
}
.popular-tracks {
  .show-more {
    button {
      padding: 4px 8px;
    }
  }
}
.similar-artists {
  .section-title {
    margin-bottom: 24px;
  }
}
.show-more {
  display: flex;

  button {
    padding: 4px 8px 4px 0;
    margin-top: 8px;
    border-radius: 6px;
    font-size: 12px;
    opacity: 0.78;
    color: var(--color-secondary);
    font-weight: 600;
    &:hover {
      opacity: 1;
    }
  }
}
</style>

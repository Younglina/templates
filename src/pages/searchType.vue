<script setup>
import { search } from '@/api/others'
import CoverRow from '@/components/CoverRow.vue'
import TrackList from '@/components/TrackList.vue'
import MvList from '@/components/MvList.vue'
import { getTrackDetail } from '@/api/track'

const tabs = {
  artists: {
    data: [],
    type: 'artist',
    label: '艺人',
    component: CoverRow,
    columnNumber: 6,
  },
  albums: {
    data: [],
    type: 'album',
    subText: 'artist',
    subTextFontSize: '14px',
    label: '专辑',
    component: CoverRow,
  },
  tracks: {
    data: [],
    type: 'playlist',
    label: '歌曲',
    columnNumber: 1,
    component: TrackList,
  },
  playlists: {
    data: [],
    type: 'playlist',
    label: '歌单',
    component: CoverRow,
    columnNumber: 5,
  },
  musicVideos: {
    data: [],
    label: '视频',
    component: MvList,
  },
}

const route = useRoute()
const currentTab = shallowRef({})

const result = ref([])
const hasMore = ref(false)
const { showPg, startPg, donePg } = useProgres()
function loadData() {
  startPg()
  const typeTable = {
    musicVideos: 1004,
    tracks: 1,
    albums: 10,
    artists: 100,
    playlists: 1000,
  }
  return search({
    keywords: route.params.keywords,
    type: typeTable[route.params.type],
    offset: result.value.length,
  }).then((res) => {
    res = res.result
    hasMore.value = res.hasMore ?? true
    switch (route.params.type) {
      case 'musicVideos':
        result.value.push(...res.mvs)
        if (res.mvCount <= result.value.length) {
          hasMore.value = false
        }
        break
      case 'artists':
        result.value.push(...res.artists)
        break
      case 'albums':
        result.value.push(...res.albums)
        if (res.albumCount <= result.value.length) {
          hasMore.value = false
        }
        break
      case 'tracks':
        result.value.push(...res.songs)
        getTracksDetail()
        break
      case 'playlists':
        result.value.push(...res.playlists)
        break
    }
    tabs[route.params.type].data = result.value
    currentTab.value = tabs[route.params.type]
    donePg()
  })
}
function getTracksDetail() {
  const trackIDs = result.value.map(t => t.id)
  if (trackIDs.length === 0)
    return
  getTrackDetail(trackIDs.join(',')).then((res) => {
    result.value = res.songs
  })
}
loadData()
</script>

<template>
  <div v-show="showPg">
    <h1>
      <span class="opacity-58">搜索 {{ currentTab.label }} </span>
      "{{ route.params.keywords }}"
    </h1>
    <component
      :is="currentTab.component"
      class="mt-24px"
      :data-list="currentTab.data"
      :type="currentTab.type"
      :sub-text="currentTab.subText"
      :sub-text-font-size="currentTab.subTextFontSize"
      :column-number="currentTab.columnNumber"
      :show-play-button="true"
    />
    <div class="mt-24px flex justify-center">
      <ButtonIcon v-show="hasMore" grey @click.native="loadData">
        加载更多
      </ButtonIcon>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>

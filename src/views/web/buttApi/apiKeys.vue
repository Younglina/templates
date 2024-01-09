<!--
 * @Author: younglina younglina0409@gmail.com
 * @Date: 2024-01-08 09:24:28
 * @Description: API keys
-->
<script setup>
const tableInfo = reactive({
  columns: [
    { prop: 'name', label: 'NAME' },
    { prop: 'key', label: 'KEY', minWidth: '400px' },
    { prop: 'time', label: 'CREATED' },
  ],
  data: [{ name: 'name', key: 'key', time: 'time' }],
})
function addNewKey() {
  ElMessageBox.prompt('给你的key取个名称', '创建新的API key', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
  })
    .then(({ value }) => {
      tableInfo.data.push({ name: value, key: 'tb-asdfasdfasdfasdfasdfasdfasdfasdfasdfafd', time: new Date().toLocaleString().replaceAll('/', '-') })
      ElMessage({
        type: 'success',
        message: `创建成功`,
      })
      // useHttp.post(`/addKey`, { key: value }).then((res) => {
      //   console.log(res)
      // }).catch(e => {
      //   ElMessage({
      //     type: 'error',
      //     message: '新增失败',
      //   })
      // })
    })
    .catch(() => {
    })
}

function handleDelete(key, idx) {
  tableInfo.data.splice(idx, 1)
  // useHttp.delete(`/deleteKey?key=${key}`).then((res) => {
  //   console.log(res)
  ElMessage({
    type: 'success',
    message: `删除成功`,
  })
  // }).catch(e => {
  //   console.log(e)
  // })
}
</script>
<template>
  <div class="api-keys">
    <the-table :tableInfo="tableInfo">
      <el-table-column label="OPERATE" width="100px">
        <template #default="scope">
          <el-popconfirm title="确定要删除这个key吗?" @confirm="handleDelete(scope.row.KEY, scope.$index)">
            <template #reference>
              <el-button text type="primary">Delete</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </the-table>
    <el-button class="mt-20px" type="primary" @click="addNewKey">创建新的key</el-button>
  </div>
</template>
<style scoped lang='scss'></style>
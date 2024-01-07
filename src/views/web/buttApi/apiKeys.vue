<script setup>
const tableInfo = {
  columns: [
    { prop: 'NAME', label: 'NAME' },
    { prop: 'KEY', label: 'KEY' },
    { prop: 'CREATED', label: 'CREATED' },
  ],
  data: [{ NAME: 'Secret key', KEY: 'tb-asdfasdfasdfasdfasdfasdfasdfasdfasdfafd', CREATED: '2024-01-07 09:35:02' }],
}
function addNewKey() {
  ElMessageBox.prompt('给你的key取个名称', '创建新的API key', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
  })
    .then(({ value }) => {
      ElMessage({
        type: 'success',
        message: `Your email is:${value}`,
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Input canceled',
      })
    })
}

function handleDelete(key) {
  console.log(key)
}
</script>
<template>
  <h1>API keys</h1>
  <p>您的API密钥如下所示。请勿与他人分享您的API密钥，也不要在浏览器或其他客户端代码中公开它。</p>
  <the-table :tableInfo="tableInfo">
    <el-table-column label="OPERATE">
      <template #default="scope">
        <el-popconfirm title="Are you sure to delete this?" @confirm="handleDelete(scope.row.KEY)">
          <template #reference>
            <el-button text type="primary">Delete</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </the-table>
  <el-button class="mt-20px" type="primary">创建新的key</el-button>
</template>
<style scoped lang='scss'></style>
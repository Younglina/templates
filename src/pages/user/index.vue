<script setup>
import { onMounted, reactive } from 'vue'
import CreateUser from './createUser.vue'
import { UserCol } from '@/constants/tableCols.js'

const tableData = reactive({
  data: [],
  columns: UserCol,
  total: 20,
})
const roles = ref([])
const searchModel = ref({
  accountName: '',
  userName: '',
  userRole: [],
  phoneNumber: '',
})
const isShowCreateUser = ref(false)
const propsForm = ref(null)
async function handleCommand(c, data) {
  console.log(c, data)
  let res
  switch (c) {
    case 'add':
      if (data.id !== undefined) {
        res = await useAxios.put('/api/user/', data)
      }
      else {
        res = await useAxios.post('/api/user', data)
      }
      console.log(res, 'res')
      break
    case 'edit':
      propsForm.value = data
      isShowCreateUser.value = true
      break
    case 'toogleUserStatus':
      res = await useAxios.put('/api/user/', data)
      break
    case 'del':
      res = await useAxios.delete(`/api/user/${data.id}`)
      break
    case 'export':
      await useExportData({ ...searchModel.value, userRole: searchModel.value.userRole.join(',') }, { type: 'user', fileName: '用户列表' })
      break
  }
  if (c !== 'toogleUserStatus') {
    getUserList()
  }
}
function getUserList() {
  useAxios.get('/api/user', { ...searchModel.value, userRole: searchModel.value.userRole.join(',') }).then((res) => {
    tableData.data = res.data
  })
}
async function getRoleList() {
  useAxios.get('/api/role').then((res) => {
    roles.value = res.data
  })
}
onMounted(() => {
  getUserList()
  getRoleList()
})
</script>

<template>
  <div>
    <TheSearch :search-model="searchModel" @search="getUserList">
      <template #default>
        <el-form-item label="账号名称" prop="accountName">
          <el-input v-model="searchModel.accountName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="searchModel.userName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="角色" prop="userRole">
          <el-select v-model="searchModel.userRole" multiple>
            <el-option v-for="item in roles" :key="item.id" :value="item.id" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="searchModel.phoneNumber" placeholder="请输入" />
        </el-form-item>
      </template>
    </TheSearch>
    <TheTable :table-data="tableData" @handle-add="handleCommand('edit', null)" @handle-export="handleCommand('export')">
      <template #userStatus>
        <el-table-column label="状态" width="200" fixed="right">
          <template #default="{ row }">
            <el-switch
              v-model="row.userStatus" width="60" inline-prompt active-text="启用" active-value="1" inactive-text="禁用"
              inactive-value="0" @change="e => handleCommand('toogleUserStatus', { userStatus: e, id: row.id })"
            />
          </template>
        </el-table-column>
      </template>

      <template #options>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <div flex items-center>
              <el-button type="primary" link @click="handleCommand('edit', row)">
                <template #icon>
                  <i i-ms-edit-square-outline />
                </template>编辑
              </el-button>
              <el-button type="danger" link @click="handleCommand('del', row)">
                <template #icon>
                  <i i-ms-delete-outline />
                </template>删除
              </el-button>
              <el-dropdown class="ml-12px" @command="(c) => handleCommand(c, row)">
                <i i-ms-more-horiz cursor-pointer />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="resetPassword">
                      重置密码
                    </el-dropdown-item>
                    <el-dropdown-item command="forceOffline">
                      强制下线
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </template>
    </TheTable>
    <CreateUser v-model:isShow="isShowCreateUser" :props-form="propsForm" @submit="d => handleCommand('add', d)" />
  </div>
</template>

<style scoped lang="scss"></style>

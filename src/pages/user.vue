<script setup>
const tableData = {
  data: [
    {
      accountName: 'wzq',
      userName: '汪',
      userRole: '系统管理员',
      phoneNumber: '151****6666',
      userStatus: '启用',
    },
    {
      accountName: 'yln',
      userName: '杨',
      userRole: '系统管理员',
      phoneNumber: '158****6666',
      userStatus: '启用',
    },
    {
      accountName: 'wny',
      userName: '葵',
      userRole: '系统管理员',
      phoneNumber: '158****6666',
      userStatus: '启用',
    },
  ],
  columns: [
    {
      prop: 'accountName',
      label: '账号名称',
    },
    {
      prop: 'userName',
      label: '用户名称',
    },
    {
      prop: 'userRole',
      label: '角色',
    },
    {
      prop: 'userStatus',
      label: '状态',
      slot: true,
    },
    {
      prop: 'phoneNumber',
      label: '手机号',
    },
  ],
  total: 20,
}
const searchModel = ref({
  accountName: '',
  userName: '',
  userRole: '',
  phoneNumber: '',
})
useAxios.get('/api/user').then((res) => {
  console.log(res, 'res')
})
function handleCommand(c, row) {
  console.log(c, row)
}
</script>

<template>
  <div>
    <TheSearch :search-model="searchModel">
      <template #default>
        <el-form-item label="账号名称" prop="accountName">
          <el-input v-model="searchModel.accountName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="searchModel.userName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="角色" prop="userRole">
          <el-input v-model="searchModel.userRole" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="searchModel.phoneNumber" placeholder="请输入" />
        </el-form-item>
      </template>
    </TheSearch>
    <TheTable :table-data="tableData">
      <template #userStatus>
        <el-table-column label="状态" width="200" fixed="right">
          <template #default="{ row }">
            <el-switch
              v-model="row.userStatus"
              width="60"
              inline-prompt
              active-text="启用"
              active-value="启用"
              inactive-text="禁用"
              inactive-value="禁用"
            />
          </template>
        </el-table-column>
      </template>

      <template #options>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <div flex items-center>
              <el-button type="primary" link @click="handleEdit(row)">
                <template #icon>
                  <i i-ms-edit-square-outline />
                </template>编辑
              </el-button>
              <el-button type="danger" link @click="handleDelete(row)">
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
  </div>
</template>

<style scoped lang="scss"></style>

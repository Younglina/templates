<script setup>
import CryptoJS from 'crypto-js'

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['submit', 'update:isShow'])
const isShow = useVModel(props, 'isShow')
const dataForm = ref({
  accountName: '',
  userName: '',
  password: '',
  userRole: [],
  phoneNumber: '',
  gender: '',
  userStatus: '1',
})
const dataFormRef = ref(null)
const rules = reactive({
  accountName: [
    { required: true, message: '请输入账号名称', trigger: 'change' },
    { min: 3, max: 20, message: '长度限制为3～20', trigger: 'change' },
  ],
  userName: [
    { required: true, message: '请输入用户名称', trigger: 'change' },
    { min: 1, max: 20, message: '长度限制为3～20', trigger: 'change' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'change' },
    { min: 6, message: '长度最少6位', trigger: 'change' },
  ],
})
function handleSubmit() {
  dataFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      const submitForm = JSON.parse(JSON.stringify(dataForm.value))
      submitForm.hashedPassword = CryptoJS.SHA256(submitForm.password).toString()
      delete submitForm.password
      emits('submit', submitForm)
      isShow.value = false
      dataFormRef.value.resetFields()
    }
    else {
      console.log('提交失败：', fields)
    }
  })
}
</script>

<template>
  <el-dialog v-model="isShow" title="新增用户" width="600">
    <el-form ref="dataFormRef" :model="dataForm" :rules="rules" label-width="90px" :inline="true" class="user-form" label-suffix=":">
      <el-form-item label="账号名称" prop="accountName">
        <el-input v-model="dataForm.accountName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="用户名称" prop="userName">
        <el-input v-model="dataForm.userName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="dataForm.password" type="password" show-password autocomplete="off" />
      </el-form-item>
      <el-form-item label="所属角色">
        <el-select v-model="dataForm.userRole" multiple>
          <el-option :value="1" label="系统管理员" />
          <el-option :value="2" label="用户管理员" />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="dataForm.phoneNumber" />
      </el-form-item>
      <el-form-item label="用户性别">
        <el-select v-model="dataForm.gender">
          <el-option :value="1">
            男
          </el-option>
          <el-option :value="0">
            女
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户状态">
        <el-switch
          v-model="dataForm.userStatus"
          width="60"
          inline-prompt
          active-text="启用"
          active-value="1"
          inactive-text="禁用"
          inactive-value="0"
        />
      </el-form-item>
      <div>
        <el-form-item label="备注">
          <el-input v-model="dataForm.remark" :rows="[3, 6]" type="textarea" style="width:445px" />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="isShow = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleSubmit">
          提交
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang='scss'>
.user-form {
  :deep(.el-input),
  :deep(.el-select) {
    width: 168px;
  }
}
</style>

<script setup>
import CryptoJS from 'crypto-js'

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  propsForm: {
    type: Object,
    default: null,
  },
})
const emits = defineEmits(['submit', 'update:isShow'])
const isShow = useVModel(props, 'isShow')

const roles = ref([])
async function getAllRoles() {
  useAxios.get('/api/role').then((res) => {
    roles.value = res.data
  })
}

const dataFormRef = ref(null)
const dataForm = ref({
  accountName: '',
  userName: '',
  password: '',
  userRole: [],
  phoneNumber: '',
  gender: '',
  userStatus: '1',
})
const rules = reactive({
  accountName: [
    { required: true, message: '请输入账号名称', trigger: 'change' },
    { min: 1, max: 20, message: '长度限制为1～20', trigger: 'change' },
  ],
  userName: [
    { required: true, message: '请输入用户名称', trigger: 'change' },
    { min: 1, max: 20, message: '长度限制为1～20', trigger: 'change' },
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
      submitForm.hashedPassword = CryptoJS.SHA256(submitForm.password, import.meta.env.VITE_ENCRYPT_KEY).toString()
      delete submitForm.password
      let res
      if (submitForm.id !== undefined) {
        res = await useAxios.put('/api/user/', submitForm)
      }
      else {
        res = await useAxios.post('/api/user', submitForm)
      }

      if (res.code === -1) {
        return ElMessage.error(res.message)
      }
      ElMessage.success(res.message)
      emits('submit')
      isShow.value = false
      dataFormRef.value.resetFields()
    }
    else {
      console.log('提交失败：', fields)
    }
  })
}

const dialogTitle = computed(() => props.propsForm ? '编辑用户' : '新增用户')
watch(() => props.isShow, async (val) => {
  await nextTick()
  if (val && props.propsForm) {
    dataForm.value = { ...props.propsForm, password: '******' }
  }
  else {
    dataFormRef.value.resetFields()
  }
})
onMounted(() => {
  getAllRoles()
})
</script>

<template>
  <el-dialog v-model="isShow" :title="dialogTitle" width="600">
    <el-form ref="dataFormRef" :model="dataForm" :rules="rules" label-width="90px" :inline="true" class="user-form" label-suffix=":">
      <el-form-item label="账号名称" prop="accountName">
        <el-input v-model="dataForm.accountName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="用户名称" prop="userName">
        <el-input v-model="dataForm.userName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="dataForm.password" :disabled="props.propsForm !== null" type="password" show-password autocomplete="off" />
      </el-form-item>
      <el-form-item label="所属角色" prop="userRole">
        <el-select v-model="dataForm.userRole" multiple>
          <el-option v-for="item in roles" :key="item.id" :value="item.id" :label="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" prop="phoneNumber">
        <el-input v-model="dataForm.phoneNumber" />
      </el-form-item>
      <el-form-item label="用户性别" prop="gender">
        <el-select v-model="dataForm.gender">
          <el-option :value="1" label="男" />
          <el-option :value="0" label="女" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户状态" prop="userStatus">
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
        <el-form-item label="备注" prop="remark">
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

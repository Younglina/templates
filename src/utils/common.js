export async function useExportData(query, options) {
  const res = await useAxios.get(`/api/${options.type}/export`, query, { responseType: 'blob' })
  const downUrl = window.URL.createObjectURL(new Blob([res]))
  const link = document.createElement('a')
  link.href = downUrl
  link.setAttribute('download', `${options.fileName || +new Date()}.xlsx`) // 设置下载的文件名
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(downUrl) // 清理临时URL
}

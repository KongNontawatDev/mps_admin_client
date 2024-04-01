function setBaseUrl() {
  const mode = import.meta.env.MODE
  if (mode === 'development') {
    return 'http://localhost:4000/'
  } else {
    return 'https://api.mps.ta-pps.com/'
  }
}

export const baseUrl = setBaseUrl()
export const baseMessage = {
  successSave: 'บันทึกข้อมูลสำเร็จ',
  successDelete: 'ลบข้อมูลสำเร็จ'
}
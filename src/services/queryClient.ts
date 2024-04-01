import { QueryClient } from '@tanstack/react-query'
import { notification } from 'antd';

function queryErrorHandler(error: unknown): void {
  const title = error instanceof Error ? error.message : 'Error Connection to Server'

  let msgToast:any = "โปรแกรมกลับมาใช้งานใหม่อีกครั้ง";

  if (title.includes('invalid token') || title.includes('code 401')) {
    //Authorization token is invalid: invalid token
    msgToast = "คุณต้อง Login เข้าสู่ระบบก่อน"
    // window.location.replace('/login')
  } else if (title.includes('token expired')) {
    //Authorization token expired
    msgToast = "คุณต้อง Login เข้าระบบก่อน"
  } else if (title.includes('ECONNREFUSED')) {
    msgToast = "ไม่สามารถติดต่อกับ SERVER ได้ในขณะนี้"
  } else if (title.includes('500')) {
    msgToast = "ไม่สามารถติดต่อกับ SERVER ได้ในขณะนี้"
  } else if (title.includes('Network Error')) {
    msgToast = "ไม่สามารถติดต่อกับ SERVER ได้ในขณะนี้"
  } else if (title.includes('404')) {
    msgToast = "URL SERVER ไม่สามารถใช้งานได้ในขณะนี้"
  } else if (title != '') {
    msgToast = title
  }

  notification.error({
    message:msgToast,
    placement:'top',
  }) 

}

const defaultQueryClientOptions = {
  queries: {
    // onError: queryErrorHandler,
    refetchOnWindowFocus: false,
    retry: false
  },
  mutation: {
    onError: queryErrorHandler
  }
}

export const queryClient = new QueryClient({
  defaultOptions: defaultQueryClientOptions
})
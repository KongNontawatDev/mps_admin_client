import type {ResponseInitType, conditionSearchInit} from "."

export type UserConditionSearch = conditionSearchInit & {
  level:number
}

/** type เริ่มต้นจากฐานข้อมูล */
export type User = {
  id: number
  user_name: string
  first_name: string
  last_name: string
  email: string
  tel: string | null
  password: string
  image: string | null
  created_at: Date | null
  level: number
}
/** * type สำหรับ request ที่ส่งมาจากฟอร์ม */
export type UserRequest = Partial<User>

/** * type สำหรับ response ส่งไปหา client */
export type UserResponses = ResponseInitType & {
  results: User[]
}
export type UserResponse = ResponseInitType & {
  results: User
}

/** * type สำหรับ params เช่น user/:id */
export type UserParams = {id: string}

/** form init schema */
export const formUserInitial:Partial<User> = {
  user_name: "",
  first_name: "",
  last_name: "",
  email: "",
  tel: "",
  image: null,
  level: 2,
}
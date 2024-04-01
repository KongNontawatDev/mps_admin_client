import type {ResponseInitType, conditionSearchInit} from "."

export type CategoryConditionSearch = conditionSearchInit & {}

/** type เริ่มต้นจากฐานข้อมูล */
export type Category = {
  id: number
  name: string | null
}
/** * type สำหรับ request ที่ส่งมาจากฟอร์ม */
export type CategoryRequest = Partial<Category>

/** * type สำหรับ response ส่งไปหา client */
export type CategoryResponses = ResponseInitType & {
  results: Category[]
}
export type CategoryResponse = ResponseInitType & {
  results: Category
}

/** * type สำหรับ params เช่น user/:id */
export type CategoryParams = {id: string}

/** form init schema */
export const formCategoryInitial:CategoryRequest = {
  name: "",
}

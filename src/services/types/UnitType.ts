import type {ResponseInitType, conditionSearchInit} from "."

export type UnitConditionSearch = conditionSearchInit & {}

/** type เริ่มต้นจากฐานข้อมูล */
export type Unit = {
  id: number
  name: string | null
}
/** * type สำหรับ request ที่ส่งมาจากฟอร์ม */
export type UnitRequest = Partial<Unit>

/** * type สำหรับ response ส่งไปหา client */
export type UnitResponses = ResponseInitType & {
  results: Unit[]
}
export type UnitResponse = ResponseInitType & {
  results: Unit
}

/** * type สำหรับ params เช่น user/:id */
export type UnitParams = {id: string}

/** form init schema */
export const formUnitInitial:UnitRequest = {
  name: "",
}

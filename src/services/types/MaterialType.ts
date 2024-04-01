import type { ResponseInitType, conditionSearchInit } from ".";
import { Category } from "./CategoryType";

export type MaterialConditionSearch = conditionSearchInit & {};

export type Material = {
  id: number
  cat_id: number | null
  sku: string | null
  name: string | null
  detail: string | null
  stock: number | null
  weight: number | null
  height: number | null
  width: number | null
  unit: string | null
  added_by: number | null
  status: number | null
  publish: number | null
  image: string | null
  created_at: Date | null
  updated_at: Date | null
  category:Pick<Category,"name">
	}
/** * type สำหรับ request ที่ส่งมาจากฟอร์ม */
export type MaterialRequest = Partial<Material>;

/** * type สำหรับ response ส่งไปหา client */
export type MaterialResponses = ResponseInitType & {
	results: Material[];
};
export type MaterialResponse = ResponseInitType & {
	results: Material;
};

/** * type สำหรับ params เช่น user/:id */
export type MaterialParams = { id: string };

/** form init schema */
export const formMaterialInitial:MaterialRequest = {
  cat_id: 0,
  sku: '',
  name: '',
  detail: '',
  stock: null,
  weight: null,
  height: null,
  width: null,
  unit: '',
  added_by: 0,
  status: 1,
  publish: 1,
  image: '',
}

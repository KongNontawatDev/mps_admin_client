import type { ResponseInitType, conditionSearchInit } from ".";
import { Org } from "./OrgType";

export type EmployeeConditionSearch = conditionSearchInit & {
  gender:string,
  status:number,
  org_id:number
};

export type Employee = {
  id: number
  line_user_id: string | null
  org_id: number
  position: string
  user_name: string | null
  id_card: string | null
  title_name: string | null
  first_name: string | null
  last_name: string | null
  tel: string | null
  gender: string | null
  address: string | null
  birthday: Date | null
  image: string | null
  amphure: string | null
  district: string | null
  province: string | null
  zip_code: string | null
  status: number | null
  created_at: Date | null
  amphure_id: number | null
  district_id: string | null
  province_id: number | null
  org:Pick<Org,"name">
	}
/** * type สำหรับ request ที่ส่งมาจากฟอร์ม */
export type EmployeeRequest = Partial<Employee>;

/** * type สำหรับ response ส่งไปหา client */
export type EmployeeResponses = ResponseInitType & {
	results: Employee[];
};
export type EmployeeResponse = ResponseInitType & {
	results: Employee;
};

/** * type สำหรับ params เช่น user/:id */
export type EmployeeParams = { id: string };

export const formEmployeeInitial:EmployeeRequest = {
  org_id: null,
  position: "",
  user_name: "",
  id_card: "",
  title_name: "",
  first_name: "",
  last_name: "",
  tel: "",
  gender: "",
  address: "",
  birthday: null,
  image: null,
  amphure: null,
  district: "",
  province: null,
  zip_code: "",
  status: null, 
}


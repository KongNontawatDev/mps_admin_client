import type { ResponseInitType, conditionSearchInit } from ".";

export type OrgConditionSearch = conditionSearchInit & {};

export type Org = {
  id: number
  name: string | null
  address: string | null
  tel: string | null
  email: string | null
  amphure: string | null
  district: string | null
  province: string | null
  zip_code: string | null
  amphure_id: number | null
  district_id: string | null
  province_id: number | null
};
/** * type สำหรับ request ที่ส่งมาจากฟอร์ม */
export type OrgRequest = Partial<Org>;

/** * type สำหรับ response ส่งไปหา client */
export type OrgResponses = ResponseInitType & {
	results: Org[];
};
export type OrgResponse = ResponseInitType & {
	results: Org;
};

/** * type สำหรับ params เช่น user/:id */
export type OrgParams = { id: string };

export const formOrgInitial: OrgRequest = {
	name: "",
  address:"",
  tel:"",
  email:"",
	amphure: null,
	district: "",
	province: null,
	zip_code: "",
};

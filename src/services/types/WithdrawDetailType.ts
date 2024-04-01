import type { ResponseInitType, conditionSearchInit } from ".";

export type WithdrawDetailConditionSearch = conditionSearchInit & {};

export type WithdrawDetail = {
  with_id: number
  mat_id: number
  amount: number | null
	}
/** * type สำหรับ request ที่ส่งมาจากฟอร์ม */
export type WithdrawDetailRequest = Partial<WithdrawDetail>;

/** * type สำหรับ response ส่งไปหา client */
export type WithdrawDetailResponses = ResponseInitType & {
	results: WithdrawDetail[];
};
export type WithdrawDetailResponse = ResponseInitType & {
	results: WithdrawDetail;
};

/** * type สำหรับ params เช่น user/:id */
export type WithdrawDetailParams = { id: string };

import type { ResponseInitType, conditionSearchInit } from ".";
import type { Category } from "./CategoryType";
import type { Employee } from "./EmployeeType";
import type { Material } from "./MaterialType";
import type { Org } from "./OrgType";
import type { WithdrawDetail } from "./WithdrawDetailType";

export type WithdrawConditionSearch = conditionSearchInit & {
	status?:string
	start_date?:string
	end_date?:string
	org_id?:string
};

export type Withdraw = {
	id: number
	emp_id: number | null
	org_id: number | null
	title_name: string
	first_name: string
	last_name: string
	worksite: string | null
	total_amount: number | null
	created_at: Date | null
	withdraw_date: Date | null
	note: string | null
	image: string | null
	image2: string | null
	status: number | null
	org:Pick<Org,"name">
	employee:Pick<Employee,"gender"|"position">
	withdraw_detail:WithdrawDetail & {
		material:Material & {
			category:Category
		}
		amount:number
	}[]
	}
/** * type สำหรับ request ที่ส่งมาจากฟอร์ม */
export type WithdrawRequest = Partial<Withdraw>;

/** * type สำหรับ response ส่งไปหา client */
export type WithdrawResponses = ResponseInitType & {
	results: Withdraw[];
};
export type WithdrawResponse = ResponseInitType & {
	results: Withdraw;
};

/** * type สำหรับ params เช่น user/:id */
export type WithdrawParams = { id: string };

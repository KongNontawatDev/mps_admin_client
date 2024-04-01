export interface ConditionFilter {
  sortorder: string
  sortfield: string
  page: number
  textfilter: string
  limit?: string
}

export type ResponseRecord = {
  results:any[]
  totalItem:number
  totalRecord:number
}

export type conditionSearchInit = {
	page?: string|any;
	sortfield?: string|any;
	sortorder?: "asc" | "desc"|any;
	textfilter?: string|any;
	limit?: string|any;
	setSearch?:Function
};

export type ResponseStatus = "success" | "created" | "updated" | "deleted" | "duplicate" | "does_not_exist" | "not_found" | "fail" | "unauthorized" | "something_went_wrong"
export type ResponseInitType = {
	totalItem?:number
	totalRecord?:number
	res_message?:ResponseStatus
	res_detail?:string
	results?:any
}

export const EmptyData = {
	results:{},
	res_message:"",
	res_detail:"",
}
export const EmptyDatas = {
	results:[],
	res_message:"",
	res_detail:"",
}

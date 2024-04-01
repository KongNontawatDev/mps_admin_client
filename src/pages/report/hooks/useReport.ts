import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../../services/http";
import { queryKeys } from "../../../services/queryKey";
import { ConditionFilter, ResponseRecord } from "../../../services/types";
import { convertOrderCondition } from "../../../utils/myFunction";
import { ReportBodyRespone } from "../types";

const url = "/report";

export interface ConditionFilterType extends ConditionFilter {
}

/**
 * fetch all data filter by condition
 * @param condition
 * @returns multi rows
 */
async function fetchReportsData( condition: ConditionFilterType, accessToken: string) {
	const params = new URLSearchParams([
		["textfilter", condition.textfilter || ""],
		["page", condition.page.toString() || "1"],
		["sortfield", condition?.sortfield || "id"],
		["sortorder", convertOrderCondition(condition?.sortorder) || "desc"],
	]);

	const { data } = await axiosInstance.get(`${url}/search`, { params,
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	return data;
}
//Hook
export function useReports(condition: ConditionFilterType, accessToken: string) {
	const [filter, setFilter] = useState(condition);

	const { data = [], isLoading, refetch, isError, error, } = useQuery([queryKeys.reports, filter], () => fetchReportsData(filter, accessToken));
	return { data:data as ReportBodyRespone[] & ResponseRecord, isLoading, setFilter, refetch, isError, error };
}

/**
 * fetch data by id
 * @param id
 * @returns one row
 */
async function fetchReportData(id: number, accessToken: string) {
	if (id == 0) {
		return {};
	}
	const { data } = await axiosInstance.get(`${url}/${id}`, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	return data;
}
//Hook
export function useReport(id: number, accessToken: string) {
	const { data = {}, isLoading, isFetching, isError, error, refetch, } = useQuery([queryKeys.report, id], () => fetchReportData(id, accessToken));
	return { data:data as ReportBodyRespone, isLoading, isFetching, isError, error, refetch };
}
/**
 * สำหรับแสดงผลไฟล์รูปภาพ
 * @param filename ชื่อไฟล์ที่จะให้แสดงผล
 * @returns
 */
export function useReportFile(filename: string) {
	return axiosInstance.getUri() + `static${url}/` + filename;
}



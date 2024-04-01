import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { convertOrderCondition } from "../../../utils/myFunction";
import { axiosInstance } from "../../../services/http";
import { queryKeys } from "../../../services/queryKey";
import {
	Withdraw,
	WithdrawConditionSearch,
	WithdrawResponses,
} from "../../../services/types/WithdrawType";

const url = "/withdraw"; //url หลักสำหรับให้เรียก api

/**
 * เรียกดูข้อมูล แบบหลายแถว มาใส่ในตาราง พร้อมส่งเงื่อนไข แบบ string query
 * @param condition เงื่อนไขการค้นหา
 * @returns
 */
export const useWithdraws = (
	condition: WithdrawConditionSearch,
	accessToken: string
) => {
	const [filter, setFilter] = useState(condition);

	const { data, isLoading, refetch, isError, error } = useQuery({
		queryKey: [queryKeys.withdraws,filter],
		queryFn: async () => {
			//สร้าง string query
			const params = new URLSearchParams([
				["textfilter", filter.textfilter || ""],
				["page", filter.page || "1"],
				["sortfield", filter?.sortfield || "id"],
				["sortorder", convertOrderCondition(filter?.sortorder) || "desc"],
				["limit", filter.limit || "10"],
				["status", filter.status || "0"],
				["org_id", filter.org_id || "0"],
				["start_date", filter.start_date || ""],
				["end_date", filter.end_date || ""],
			]);
			
			const response = await axiosInstance.get(`${url}/search`, {
				params,
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			return response.data;
		},
	});

	return {
		data: data as WithdrawResponses,
		isLoading,
		setFilter,
		refetch,
		isError,
		error,
	};
};

/**
 * เรียกดูข้อมูล แบบแถวเดียว
 * @param id
 * @returns
 */
export const useWithdraw = (id: number, accessToken: string) => {
	const { data, isLoading, refetch, isError, error } = useQuery({
		queryKey: [queryKeys.withdraw, id],
		queryFn: async () => {
			if (id === 0) {
				return { res_message: "", res_detail: "", results: {} };
			}
			const response = await axiosInstance.get(`${url}/${id}`, {
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			return response.data;
		},
	});

	return {
		data: data?.results as Withdraw,
		isLoading,
		refetch,
		isError,
		error,
	};
};

/**
 * สำหรับแสดงผลไฟล์รูปภาพ
 * @param filename ชื่อไฟล์ที่จะให้แสดงผล
 * @returns
 */
export function useWithdrawImage(filename: string) {
	return axiosInstance.getUri() + `static${url}/` + filename;
}

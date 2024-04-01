import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { convertOrderCondition } from "../../../utils/myFunction";
import { axiosInstance } from "../../../services/http";
import { queryKeys } from "../../../services/queryKey";
import {
	User,
	UserConditionSearch,
	UserResponses,
} from "../../../services/types/UserType";

const url = "/user"; //url หลักสำหรับให้เรียก api

/**
 * เรียกดูข้อมูล แบบหลายแถว มาใส่ในตาราง พร้อมส่งเงื่อนไข แบบ string query
 * @param condition เงื่อนไขการค้นหา
 * @returns
 */
export const useUsers = (
	condition: UserConditionSearch,
	accessToken: string
) => {
	const [filter, setFilter] = useState(condition);

	const { data, isLoading, refetch, isError, error } = useQuery({
		queryKey: [queryKeys.users,filter],
		queryFn: async () => {
			//สร้าง string query
			const params = new URLSearchParams([
				["textfilter", filter.textfilter || ""],
				["page", filter.page || "1"],
				["sortfield", filter?.sortfield || "id"],
				["sortorder", convertOrderCondition(filter?.sortorder) || "desc"],
				["limit", filter.limit || "10"],
				["level", filter.level || "0"],
			]);
			
			const response = await axiosInstance.get(`${url}/search`, {
				params,
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			return response.data;
		},
	});

	return {
		data: data as UserResponses,
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
export const useUser = (id: number, accessToken: string) => {
	const { data, isLoading, refetch, isError, error,isFetching } = useQuery({
		queryKey: [queryKeys.user, id],
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
		data: data?.results as User,
		isLoading,
		isFetching,
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
export function useUserImage(filename: string) {
	return axiosInstance.getUri() + `static${url}/` + filename;
}
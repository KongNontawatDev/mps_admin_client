import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { convertOrderCondition } from "../../../utils/myFunction";
import { axiosInstance } from "../../../services/http";
import { queryKeys } from "../../../services/queryKey";
import {
	Unit,
	UnitConditionSearch,
	UnitResponses,
} from "../../../services/types/UnitType";

const url = "/unit"; //url หลักสำหรับให้เรียก api

/**
 * เรียกดูข้อมูล แบบหลายแถว มาใส่ในตาราง พร้อมส่งเงื่อนไข แบบ string query
 * @param condition เงื่อนไขการค้นหา
 * @returns
 */
export const useUnits = (
	condition: UnitConditionSearch,
	accessToken: string
) => {
	const [filter, setFilter] = useState(condition);

	const { data, isLoading, refetch, isError, error } = useQuery({
		queryKey: [queryKeys.units,filter],
		queryFn: async () => {
			//สร้าง string query
			const params = new URLSearchParams([
				["textfilter", filter.textfilter || ""],
				["page", filter.page || "1"],
				["sortfield", filter?.sortfield || "id"],
				["sortorder", convertOrderCondition(filter?.sortorder) || "desc"],
				["limit", filter.limit || "10"],
			]);
			
			const response = await axiosInstance.get(`${url}/search`, {
				params,
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			return response.data;
		},
	});

	return {
		data: data as UnitResponses,
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
export const useUnit = (id: number, accessToken: string) => {
	const { data, isLoading,isFetching, refetch, isError, error } = useQuery({
		queryKey: [queryKeys.unit, id],
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
		data: data?.results as Unit,
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
export function useUnitImage(filename: string) {
	return axiosInstance.getUri() + `static${url}/` + filename;
}

//Get all Data NO Filter
async function fetchUnitOptions(accessToken:string) {
	const { data } = await axiosInstance.get(`${url}`,{
				headers: { Authorization: `Bearer ${accessToken}` },
			});
	return data;
}
//Hook Get all Data NO Filter
export function useUnitOptions(accessToken:string) {
	const { data = [], isLoading } = useQuery([queryKeys.units, "option"], () => fetchUnitOptions(accessToken));
	return { data:data?.results as Unit[], isLoading };
}



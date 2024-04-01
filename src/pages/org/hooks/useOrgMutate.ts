import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../services/http";
import { queryKeys } from "../../../services/queryKey";
import {
	OrgRequest,
	OrgResponse,
} from "../../../services/types/OrgType";

const url = "/org"; //url หลักสำหรับให้เรียก api

/**
 * บันทึกข้อมูล หรืออัพเดตข้อมูล เช็คจาก id ที่ส่งมา
 * @param formData
 */
export function useOrgSave(accessToken: string) {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: async (formData: OrgRequest) => {
			let response;
			if (formData.id && formData.id !== 0) {
				//ถ้ามี id ส่งมาด้วยแสดงว่าเป็นการอัพเดตข้อมูล
				response = await axiosInstance.patch(
					`${url}/${formData.id}`,
					formData,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);
			} else {
				//ถ้าไม่มี id หรือ id=0 แสดงว่าเป็นการเพิ่มข้อมูล
				response = await axiosInstance.post(url, formData, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
			}
			return response.data as OrgResponse;
		},
		onSuccess: (data: any) => {
			if (data.message != "fail") {
				return queryClient.invalidateQueries({
					queryKey: [queryKeys.orgs],
				});
			}
		},
	});
	return mutation;
}

/**
 * ลบข้อมูลตาม id ที่ส่งเข้ามา
 * @param id
 */
export function useOrgDelete(accessToken: string) {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (id: number) => {
			if (id === 0) {
				return {};
			}
			const response = await axiosInstance.delete(`${url}/${id}`, {
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			return response.data as OrgResponse;
		},
		onSuccess: () => {
			return queryClient.invalidateQueries({ queryKey: [queryKeys.orgs] });
		},
	});

	return mutation;
}
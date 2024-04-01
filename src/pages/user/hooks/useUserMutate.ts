import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../services/http";
import { queryKeys } from "../../../services/queryKey";
import { UserRequest, UserResponse, } from "../../../services/types/UserType";

const url = "/user"; //url หลักสำหรับให้เรียก api

/**
 * บันทึกข้อมูล หรืออัพเดตข้อมูล เช็คจาก id ที่ส่งมา
 * @param formData
 */
export function useUserSave(accessToken: string) {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: async (formData: UserRequest) => {
			let response;
			if (formData.id && formData.id !== 0) {
				//ถ้ามี id ส่งมาด้วยแสดงว่าเป็นการอัพเดตข้อมูล
				response = await axiosInstance.patch(
					`${url}/${formData.id}`,
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);
			} else {
				//ถ้าไม่มี id หรือ id=0 แสดงว่าเป็นการเพิ่มข้อมูล
				response = await axiosInstance.post(url, formData, {
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${accessToken}`,
					},
				});
			}
			return response.data as UserResponse;
		},
		onSuccess: (data: any) => {
			if (data.message != "fail") {
				return queryClient.invalidateQueries({
					queryKey: [queryKeys.users],
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
export function useUserDelete(accessToken: string) {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (id: number) => {
			if (id === 0) {
				return {};
			}
			const response = await axiosInstance.delete(`${url}/${id}`, {
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			return response.data as UserResponse;
		},
		onSuccess: () => {
			return queryClient.invalidateQueries({ queryKey: [queryKeys.users] });
		},
	});

	return mutation;
}


/**
 * ลบรูปตามชื่อรูป ที่ส่งเข้ามา
 * @param data {file,id}
 */
async function unuploadOne(data: any, accessToken: string) {

	let response = await axiosInstance.get(`${url}/unupload/${data.id}/${data.file}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	return response.data;
}
//Hook
export function useCustomerUnupload(accessToken: string) {
	const mutation = useMutation((data) => unuploadOne(data, accessToken), {
	});
	return mutation;
}

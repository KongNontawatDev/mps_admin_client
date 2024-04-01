import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../services/http";
import { queryKeys } from "../../../services/queryKey";
import { MaterialRequest, MaterialResponse, } from "../../../services/types/MaterialType";

const url = "/material"; //url หลักสำหรับให้เรียก api

/**
 * บันทึกข้อมูล หรืออัพเดตข้อมูล เช็คจาก id ที่ส่งมา
 * @param formData
 */
export function useMaterialSave(accessToken: string) {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: async (formData: MaterialRequest) => {
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
			return response.data as MaterialResponse;
		},
		onSuccess: (data: any) => {
			if (data.message != "fail") {
				return queryClient.invalidateQueries({
					queryKey: [queryKeys.materials],
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
export function useMaterialDelete(accessToken: string) {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (id: number) => {
			if (id === 0) {
				return {};
			}
			const response = await axiosInstance.delete(`${url}/${id}`, {
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			return response.data as MaterialResponse;
		},
		onSuccess: () => {
			return queryClient.invalidateQueries({ queryKey: [queryKeys.materials] });
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

/**
 * อัพเดตข้อมูลสถานะ เช็คจาก id ที่ส่งมา
 * @param formData
 */
export function useMaterialUpdateStatus(accessToken: string) {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: async (formData: MaterialRequest) => {
			let response;
				//ถ้ามี id ส่งมาด้วยแสดงว่าเป็นการอัพเดตข้อมูล
				response = await axiosInstance.patch( `${url}/status/${formData.id}`, {status:formData.status}, {
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);
			
			return response.data as MaterialResponse;
		},
		onSuccess: (data: any) => {
			if (data.message != "fail") {
				return queryClient.invalidateQueries({
					queryKey: [queryKeys.materials],
				});
			}
		},
	});
	return mutation;
}

/**
 * อัพเดตข้อมูลสถานะ เช็คจาก id ที่ส่งมา
 * @param formData
 */
export function useMaterialUpdatePublish(accessToken: string) {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: async (formData: MaterialRequest) => {
			let response;
				//ถ้ามี id ส่งมาด้วยแสดงว่าเป็นการอัพเดตข้อมูล
				response = await axiosInstance.patch( `${url}/publish/${formData.id}`, {publish:formData.publish}, {
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);
			
			return response.data as MaterialResponse;
		},
		onSuccess: (data: any) => {
			if (data.message != "fail") {
				return queryClient.invalidateQueries({
					queryKey: [queryKeys.materials],
				});
			}
		},
	});
	return mutation;
}

/**
 * อัพเดตข้อมูลสถานะ เช็คจาก id ที่ส่งมา
 * @param formData
 */
export function useMaterialUpdateStock(accessToken: string) {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: async (formData: MaterialRequest) => {
			let response;
				//ถ้ามี id ส่งมาด้วยแสดงว่าเป็นการอัพเดตข้อมูล
				response = await axiosInstance.patch( `${url}/stock/${formData.id}`, formData, {
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);
			
			return response.data as MaterialResponse;
		},
		onSuccess: (data: any) => {
			if (data.message != "fail") {
				return queryClient.invalidateQueries({
					queryKey: [queryKeys.materials],
				});
			}
		},
	});
	return mutation;
}

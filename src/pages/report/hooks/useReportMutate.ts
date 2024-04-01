import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../services/http";
import { queryKeys } from "../../../services/queryKey";

const url = "/report";

/**
 * Save on row (post, patch) Feed
 * @param formData
 * @returns post=row, patch=1 is success
 */
async function saveOne(formData: any, accessToken: string) {
	let response;
	delete formData.confirmPassword;
	if (formData.id) {
		response = await axiosInstance.patch(`${url}/${formData.id}`, formData, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
	} else {
		response = await axiosInstance.post(url, formData, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
	}

	return response.data;
}
//Hook
export function useReportSave(accessToken: string) {
	const queryClient = useQueryClient();
	const mutation = useMutation((formData) => saveOne(formData, accessToken), {
		onSuccess: (data) => {
			if (data.message != "fail") {
				return queryClient.invalidateQueries([queryKeys.reports]);
			}
		},
	});
	return mutation;
}

/**
 * Delete on row
 * @param id
 * @returns 1 is success
 */
async function deleteOne(id: number, accessToken: string) {
	const data = await axiosInstance.delete(`${url}/${id}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	return data;
}
//Hook
export function useReportDelete(accessToken: string) {
	const queryClient = useQueryClient();

	const mutation = useMutation((id: number) => deleteOne(id, accessToken), {
		onSuccess: () => {
			return queryClient.invalidateQueries([queryKeys.reports]);
		},
	});

	return mutation;
}

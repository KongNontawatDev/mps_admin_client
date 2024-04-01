import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../../services/http";
import { queryKeys } from "../../../services/queryKey";
import { DashboardBodyRespone } from "../types";

const url = "/dashboard";


async function fetchDashboardDatas(accessToken: string) {

	const { data } = await axiosInstance.get(`${url}/`, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	return data;
}
//Hook
export function useDashboards(accessToken: string) {
	const { data = {}, isLoading, isFetching, isError, error, refetch, } = useQuery([queryKeys.dashboard], () => fetchDashboardDatas(accessToken));
	return { data:data.results as DashboardBodyRespone, isLoading, isFetching, isError, error, refetch };
}




import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../../services/http";
import { queryKeys } from "../../../services/queryKey";

//Get all Data NO Filter
async function fetchProvinceOptions(accessToken: string) {
	const { data } = await axiosInstance.get(`/province`, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	return data;
}
//Hook Get all Data NO Filter
export function useProvinceOptions(accessToken: string) {
	const {
		data = [],
		isLoading,
		refetch,
	} = useQuery([queryKeys.province, "options"], () =>
		fetchProvinceOptions(accessToken)
	);
	return { data: data.results, isLoading, refetch };
}

//Get all Data with province_id
async function fetchAmphureOptions(province_id: number, accessToken: string) {
	if (province_id == 0) {
		return [];
	}
	const { data } = await axiosInstance.get(`/amphure/${province_id}`, {
		params: { province_id },
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	return data;
}
//Hook Get all Data with province_id
export function useAmphureOptions(province_id: number, accessToken: string) {
	const [filter, setFilter] = useState(province_id);
	const { data = [], isLoading } = useQuery(
		[queryKeys.amphure, "options", filter],
		() => fetchAmphureOptions(filter, accessToken)
	);
	return { data: data.results, isLoading, setFilter };
}

//Get all Data with amphure_id
async function fetchDistrictOptions(amphure_id: number, accessToken: string) {
	if (amphure_id == 0) {
		return [];
	}
	const { data } = await axiosInstance.get(`/district/${amphure_id}`, {
		params: { amphure_id },
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	return data;
}
//Hook Get all Data with amphure_id
export function useDistrictOptions(amphure_id: number, accessToken: string) {
	const [filter, setFilter] = useState(amphure_id);
	const { data = [], isLoading } = useQuery(
		[queryKeys.district, "options", filter],
		() => fetchDistrictOptions(filter, accessToken)
	);
	return { data: data.results, isLoading, setFilter };
}

//Get all Data with district_id
async function fetchZipCode(id: number, accessToken: string) {
	if (id == 0) {
		return {};
	}
	const { data } = await axiosInstance.get(`/zipcode`, {
		params: { id },
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	return data;
}
//Hook Get all Data with code
export function useZipCode(id: number, accessToken: string) {
	const [filter, setFilter] = useState(id);
	const { data = {}, isLoading } = useQuery(
		[queryKeys.zipcode, "options", filter],
		() => fetchZipCode(filter, accessToken)
	);
	return { data: data.results, isLoading, setFilter };
}

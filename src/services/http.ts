import axios, { AxiosRequestConfig } from "axios";
import { baseUrl } from "./constant";

const config: AxiosRequestConfig = {
	baseURL: baseUrl,
	// withCredentials: true,
};
const axiosInstance = axios.create(config);

export { axiosInstance };

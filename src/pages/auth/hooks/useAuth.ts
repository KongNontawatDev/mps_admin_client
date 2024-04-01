import { axiosInstance } from "../../../services/http";
import { FormConfirmPasswordType, FormLoginResponse, FormLoginType, FormResetPasswordType } from "../types";

const url = "/login";

export async function authLogin(
	formData: FormLoginType
): Promise<FormLoginResponse> {
	const response = await axiosInstance
		.post(url, formData)
		.then((res) => res.data)
		.catch((error) => {
			throw error;
		});
	return response.results;
}


export async function authRefreshToken(
	token: string
): Promise<FormLoginResponse> {
	const response = await axiosInstance
		.post(
			"/refresh-token",
			{},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)
		.then((res) => res.data)
		.catch((error) => {
			throw error;
		});
	return response.results;
}

export async function authResetPassword( formData: FormResetPasswordType): Promise<FormLoginResponse> {
	const response = await axiosInstance
		.post("/resetpassword", formData)
		.then((res) => res.data)
		.catch((error) => {
			throw error;
		});
	return response.results;
}

export async function authConfirmPassword( formData: FormConfirmPasswordType): Promise<FormLoginResponse> {
	const response = await axiosInstance
		.post("/confirmpassword", formData)
		.then((res) => res.data)
		.catch((error) => {
			throw error;
		});
	return response.results;
}

export default {
	authLogin,
	authRefreshToken,
	authResetPassword,
	authConfirmPassword
};

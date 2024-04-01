import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { FormLoginResponse } from "../services/types/AuthType";

const initUser = {
	id: 0,
	user_name: "",
	first_name: "",
	last_name: "",
	image: "",
	level:0,
};

export type AuthStateType = {
	user_name?: string;
	password?: string;
	setRemember: (user_name: string, password: string) => void;

	isLoggedIn?: boolean;
	setIsLoggedIn: (value: boolean) => void;

	accessToken: string;
	setAccessToken: (value: string) => void;

	user?: Partial<FormLoginResponse>;
	setUser: (value: Partial<FormLoginResponse>) => void;

	resetAuth: () => void;
}

const useAuthStore = create<AuthStateType>()(
	devtools(
		persist(
			(set) => ({
				isLoggedIn: false,
				accessToken: "",
				user:initUser,
				setIsLoggedIn(value) {
					set(() => ({ isLoggedIn: value }));
				},
				setAccessToken(value) {
					set(() => ({ accessToken: value }));
				},
				setUser(value: Partial<FormLoginResponse>) {
					set(() => ({ user: value }));
				},
				resetAuth() {
					set(() => ({
						isLoggedIn: false,
						accessToken: "",
						user: initUser,
					}))
				},
				setRemember(user_name, password) {
					set(() => ({
						user_name,
						password,
					}))
				},
			}),
			{ name: "authStore" }
		)
	)
);

export default useAuthStore;

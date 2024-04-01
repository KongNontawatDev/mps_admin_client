import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";


export type UserStoreAction = {
	setUserFilter: (value: UserStoreType) => void;
	resetUserFilter: () => void;
};

const initialState = {
	textfilter: "",
  searchState:true,
	page: 1,
	level:'',
};

type ConvertTypeToObject<T> = {
  [K in keyof T]: T[K];
};

export type UserStoreType = ConvertTypeToObject<typeof initialState>;

const useUserStore = create<UserStoreType & UserStoreAction>()(
	devtools(
		persist(
			(set) => ({
				...initialState,
				setUserFilter: (value: UserStoreType) => {
					set(value);
				},
				resetUserFilter: () => {
					set(initialState);
				},
			}),
			{ name: "userStore" }
		)
	)
);

export default useUserStore;

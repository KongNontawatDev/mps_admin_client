import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export type StoreAction = {
	setEmployeeFilter: (value: StoreType) => void;
	resetEmployeeFilter: () => void;
};

const initialState = {
	textfilter: "",
	searchState: true,
	page: 1,
	org_id: 0,
	gender: "",
	status: 0,
};

type ConvertTypeToObject<T> = {
	[K in keyof T]: T[K];
};

export type StoreType = ConvertTypeToObject<typeof initialState>;

const useEmployeeStore = create<StoreType & StoreAction>()(
	devtools(
		persist(
			(set) => ({
				...initialState,
				setEmployeeFilter: (value: StoreType) => {
					set(value);
				},
				resetEmployeeFilter: () => {
					set(initialState);
				},
			}),
			{ name: "employeeStore" }
		)
	)
);

export default useEmployeeStore;

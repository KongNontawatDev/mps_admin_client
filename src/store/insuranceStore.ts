import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";


export type InsuranceStoreAction = {
	setInsuranceFilter: (value: InsuranceStoreType) => void;
	resetInsuranceFilter: () => void;
};

const initialState = {
	textfilter: "",
  searchState:true,
	page: 1,
};

type ConvertTypeToObject<T> = {
  [K in keyof T]: T[K];
};

export type InsuranceStoreType = ConvertTypeToObject<typeof initialState>;

const useInsuranceStore = create<InsuranceStoreType & InsuranceStoreAction>()(
	devtools(
		persist(
			(set) => ({
				...initialState,
				setInsuranceFilter: (value: InsuranceStoreType) => {
					set(value);
				},
				resetInsuranceFilter: () => {
					set(initialState);
				},
			}),
			{ name: "insuranceStore" }
		)
	)
);

export default useInsuranceStore;

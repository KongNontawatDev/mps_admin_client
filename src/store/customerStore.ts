import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";


export type CustomerStoreAction = {
	setCustomerFilter: (value: CustomerStoreType) => void;
	resetCustomerFilter: () => void;
};

const initialState = {
	textfilter: "",
  searchState:true,
	page: 1,
	gender:'',
};

type ConvertTypeToObject<T> = {
  [K in keyof T]: T[K];
};

export type CustomerStoreType = ConvertTypeToObject<typeof initialState>;

const useCustomerStore = create<CustomerStoreType & CustomerStoreAction>()(
	devtools(
		persist(
			(set) => ({
				...initialState,
				setCustomerFilter: (value: CustomerStoreType) => {
					set(value);
				},
				resetCustomerFilter: () => {
					set(initialState);
				},
			}),
			{ name: "customerStore" }
		)
	)
);

export default useCustomerStore;

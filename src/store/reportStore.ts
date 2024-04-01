import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";


export type StoreAction = {
	setReportFilter: (value: StoreType) => void;
	resetReportFilter: () => void;
};

const initialState = {
	textfilter: "",
  searchState:true,
	page: 1,
};

type ConvertTypeToObject<T> = {
  [K in keyof T]: T[K];
};

export type StoreType = ConvertTypeToObject<typeof initialState>;

const useReportStore = create<StoreType & StoreAction>()(
	devtools(
		persist(
			(set) => ({
				...initialState,
				setReportFilter: (value: StoreType) => {
					set(value);
				},
				resetReportFilter: () => {
					set(initialState);
				},
			}),
			{ name: "reportStore" }
		)
	)
);

export default useReportStore;

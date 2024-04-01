import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";


export type UnitStoreAction = {
	setUnitFilter: (value: UnitStoreType) => void;
	resetUnitFilter: () => void;
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

export type UnitStoreType = ConvertTypeToObject<typeof initialState>;

const useUnitStore = create<UnitStoreType & UnitStoreAction>()(
	devtools(
		persist(
			(set) => ({
				...initialState,
				setUnitFilter: (value: UnitStoreType) => {
					set(value);
				},
				resetUnitFilter: () => {
					set(initialState);
				},
			}),
			{ name: "unitStore" }
		)
	)
);

export default useUnitStore;

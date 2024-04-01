import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";


export type MaterialStoreAction = {
	setMaterialFilter: (value: MaterialStoreType) => void;
	resetMaterialFilter: () => void;
};

const initialState = {
	textfilter: "",
  searchState:true,
	page: 1,
};

type ConvertTypeToObject<T> = {
  [K in keyof T]: T[K];
};

export type MaterialStoreType = ConvertTypeToObject<typeof initialState>;

const useMaterialStore = create<MaterialStoreType & MaterialStoreAction>()(
	devtools(
		persist(
			(set) => ({
				...initialState,
				setMaterialFilter: (value: MaterialStoreType) => {
					set(value);
				},
				resetMaterialFilter: () => {
					set(initialState);
				},
			}),
			{ name: "materialStore" }
		)
	)
);

export default useMaterialStore;

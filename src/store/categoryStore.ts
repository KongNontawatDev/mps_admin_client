import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";


export type CategoryStoreAction = {
	setCategoryFilter: (value: CategoryStoreType) => void;
	resetCategoryFilter: () => void;
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

export type CategoryStoreType = ConvertTypeToObject<typeof initialState>;

const useCategoryStore = create<CategoryStoreType & CategoryStoreAction>()(
	devtools(
		persist(
			(set) => ({
				...initialState,
				setCategoryFilter: (value: CategoryStoreType) => {
					set(value);
				},
				resetCategoryFilter: () => {
					set(initialState);
				},
			}),
			{ name: "categoryStore" }
		)
	)
);

export default useCategoryStore;

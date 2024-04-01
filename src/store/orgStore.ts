import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";


export type OrgStoreAction = {
	setOrgFilter: (value: OrgStoreType) => void;
	resetOrgFilter: () => void;
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

export type OrgStoreType = ConvertTypeToObject<typeof initialState>;

const useOrgStore = create<OrgStoreType & OrgStoreAction>()(
	devtools(
		persist(
			(set) => ({
				...initialState,
				setOrgFilter: (value: OrgStoreType) => {
					set(value);
				},
				resetOrgFilter: () => {
					set(initialState);
				},
			}),
			{ name: "orgStore" }
		)
	)
);

export default useOrgStore;

import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";


export type WithdrawStoreAction = {
	setWithdrawFilter: (value: WithdrawStoreType) => void;
	resetWithdrawFilter: () => void;
};

const initialState = {
	textfilter: "",
  searchState:true,
	page: 1,
	status:0,
	org_id:0,
	start_date:"",
	end_date:""
};

type ConvertTypeToObject<T> = {
  [K in keyof T]: T[K];
};

export type WithdrawStoreType = ConvertTypeToObject<typeof initialState>;

const useWithdrawStore = create<WithdrawStoreType & WithdrawStoreAction>()(
	devtools(
		persist(
			(set) => ({
				...initialState,
				setWithdrawFilter: (value: WithdrawStoreType) => {
					set(value);
				},
				resetWithdrawFilter: () => {
					set(initialState);
				},
			}),
			{ name: "WithdrawStore" }
		)
	)
);

export default useWithdrawStore;

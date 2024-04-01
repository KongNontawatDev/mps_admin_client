import { create } from "zustand";
import { persist,devtools } from "zustand/middleware";

export type ThemeStateType = {
	themeMode?: "light" | "dark";
	switchThemeMode: () => void;

	sidebarCollapse?:boolean
	sidebarCollapseWidth?:number
	setSidebarCollapse:(value:boolean)=>void
	setSidebarCollapseWidth:(value:number)=>void

	sidebarActive?:any
	setSidebarActive:(key:string[])=>void

}

const useThemeStore = create<ThemeStateType>()(
	devtools(
		persist((set) => ({
			themeMode: "light",
			sidebarActive:["sub1"],
			sidebarCollapse:false,
			sidebarCollapseWidth:1,
			switchThemeMode() {
				set((state) => ({
					themeMode: state.themeMode === "light" ? "dark" : "light",
				}));
			},
			setSidebarCollapse(value) {
				set(()=> ({
					sidebarCollapse: value
				}))
			},
			setSidebarCollapseWidth(value) {
				set(()=> ({
					sidebarCollapseWidth: value
				}))
			},
			setSidebarActive(key) {
				set(()=> ({
					sidebarActive:key
				}))
			},
		}),{name:'themeStore'})
	)
);

export default useThemeStore;

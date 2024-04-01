import { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
	QueryClientProvider,
} from "@tanstack/react-query";
import { ConfigProvider, notification, theme } from "antd";
import 'dayjs/locale/th';
import locale from 'antd/locale/th_TH';

import Pagenotfound from "./pages/Pagenotfound";
import LayoutDashboard from "./components/layout-private";
import useThemeStore from "./store/themeStore";
import { queryClient } from "./services/queryClient";
import LoginForm from "./pages/auth";
import AuthLayout from "./components/AuthLayout";
import PrivateRoute from "./components/layout-private/PrivateRoute";
import Logout from "./components/layout-private/Logout";
import EmptyData from "./components/EmptyData";
import ResetPasswordForm from "./pages/auth/ResetPassword";
import ConfirmPasswordForm from "./pages/auth/ConfirmPassword";

const User = lazy(() => import("./pages/user"));
const Employee = lazy(() => import("./pages/employee"));
// const EmployeeForm = lazy(() => import("./pages/employee/components/EmployeeForm"));
// const EmployeeDetail = lazy(() => import("./pages/employee/EmployeeDetail"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const Withdraw = lazy(() => import("./pages/withdraw"));
const Unit = lazy(() => import("./pages/unit"));
const Org = lazy(() => import("./pages/org"));
const Category = lazy(() => import("./pages/category"));
const Material = lazy(() => import("./pages/material"));
const Report = lazy(() => import("./pages/report"));

const Changelog = lazy(() => import("./pages/Changelog"));

function App() {
	const [themeMode] = useThemeStore((state) => [state.themeMode]);
	notification.config({
  placement: 'bottomLeft',
});

	return (
		<QueryClientProvider client={queryClient}>
			<ConfigProvider
				theme={{
					token: {
						fontFamily: "Kanit",
						colorPrimary: "#f66c26",
						colorPrimaryBgHover: "#fce6db",
						colorWarning: "#FF9F43",
						colorWarningBg: "#FFEFE1",
						colorSuccess: "#28C76F",
						colorSuccessBg: "#DCF6E8",
						colorError: "#EA5455",
						colorErrorBg: "#FBE3E4",
						colorInfo: "#00CFE8",
						colorInfoBg: "#D6F7FB",

						fontSize: 16,
					},
					components: {
						Input:{
							colorPrimaryActive:'#28C76F',
							colorPrimary:'#28C76F',
							activeBorderColor:'#28C76F',
							hoverBorderColor:'#28C76F',
							activeShadow:'0 0 0 2px rgb(180, 253, 213)69',
						},
						Menu:{
							itemActiveBg:'#f66c26',
							itemSelectedBg:'#f66c26',
							itemSelectedColor:'#fff',
							itemHoverBg:'#f66c26',
							itemHoverColor:'#fff',
						},
						Radio:{
							colorPrimary:'#f66c26'
						},
						Checkbox:{
							colorPrimary:'#f66c26',
							colorPrimaryHover:'#f3772f',
						},
						Button: {
							controlHeight: 36,
							paddingContentHorizontal: 20,
						},
						Typography: {
							colorLink: "#1d7aeb",
							colorLinkHover: "#4599FF",
						},
						Modal: {
							titleFontSize:20
						},
						Slider: {
							colorBgElevated:'#f66c26',
						}
					},
					algorithm:
						themeMode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
				}}
				renderEmpty={()=><EmptyData/>}
				locale={locale}
			>
				<BrowserRouter>
					<Routes>
						<Route element={<PrivateRoute/>}>
						<Route element={ <LayoutDashboard /> }>
							<Route index path="/" element={<Dashboard/>} />
							<Route path="/home" element={<Dashboard/>} />
							<Route path="/dashboard" element={<Dashboard/>} />
							<Route path="/user" element={<User />} />
							<Route path="/employee" element={<Employee />} />
							{/* <Route path="/employee/add" element={<EmployeeForm />} /> */}
							{/* <Route path="/employee/edit/:id" element={<EmployeeForm />} /> */}
							{/* <Route path="/employee/detail/:id" element={<EmployeeDetail />} /> */}
							<Route path="/withdraw" element={<Withdraw />} />
							<Route path="/unit" element={<Unit />} />
							<Route path="/org" element={<Org />} />
							<Route path="/category" element={<Category />} />
							<Route path="/material" element={<Material />} />
							<Route path="/report" element={<Report />} />

							<Route path="/changelog" element={<Changelog />} />
							<Route path="*" element={<Pagenotfound />} />
						</Route>
						</Route>
						<Route element={<AuthLayout/>}>
							<Route path="/login" element={<LoginForm/>}/>
							<Route path="/resetpassword" element={<ResetPasswordForm/>}/>
							<Route path="/confirmpassword/:id" element={<ConfirmPasswordForm/>}/>
						</Route>
						<Route path="/logout" element={<Logout/>}/>
					</Routes>
				</BrowserRouter>
			</ConfigProvider>
		</QueryClientProvider>
	);
}

export default App;

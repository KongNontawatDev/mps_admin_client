import React, { Suspense, useEffect, useState } from "react";
import type { MenuProps } from "antd";
import { Layout, Menu, Typography, Space, Image, theme } from "antd";
import EmptyLoading from "../../pages/EmptyLoading";
import { Outlet, useLocation, useNavigate,Link } from "react-router-dom";
import useThemeStore from "../../store/themeStore";
import { items, rootSubmenuKeys } from "./menu";
import SidebarHeader from "./Header";

const { Content, Sider } = Layout;
const { Title } = Typography;

const LayoutDashboard: React.FC = () => {
	let navigate = useNavigate();
	const location = useLocation();
	const [pathUrl] = useState(window.location.pathname);
	const {
		token: { colorPrimary },
	} = theme.useToken();
	const [
		sidebarCollapse,
		sidebarCollapseWidth,
		sidebarActive,
		setSidebarCollapse,
		setSidebarCollapseWidth,
		setSidebarActive,
		,
	] = useThemeStore((state) => [
		state.sidebarCollapse,
		state.sidebarCollapseWidth,
		state.sidebarActive,
		state.setSidebarCollapse,
		state.setSidebarCollapseWidth,
		state.setSidebarActive,
	]);

	const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
		const latestOpenKey = keys.find((key) => sidebarActive.indexOf(key) === -1);

		if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
			setSidebarActive(keys);
		} else {
			setSidebarActive(latestOpenKey ? [latestOpenKey] : []);
		}
	};

	useEffect(() => {
		const regex = /\/\s*(.*?)\s*\//g;
		const matches = pathUrl.match(regex);
		if (matches && matches.length > 0) {
			const betweenValue = matches[0].replace(/\//g, "").trim();
			onOpenChange([betweenValue]);
		}
	}, []);

	const onBreakPoint = (value: boolean) => {
		if (window.innerWidth <= 768) {
			value
				? [setSidebarCollapse(value), setSidebarCollapseWidth(1)]
				: setSidebarCollapseWidth(1);
		}else {
			setSidebarCollapse(false)
		}
	};

	const onCollapse = (value: boolean, type: any) => {
		if (type == "clickTrigger") {
			setSidebarCollapse(value);
			setSidebarCollapseWidth(80);
		}
	};

	const selectKeyActive = (path: string): string[] => {
    const parts = path.split('/').filter(part => part !== ''); // Split and remove empty parts
    const result = parts.map(part => '/' + part); // Add leading '/' to each part
		result.push(path)
    return result;
}

	return (
		<Layout style={{ minHeight: "100vh" }}>
			<Sider
				breakpoint="md"
				theme="light"
				width={250}
				collapsedWidth={sidebarCollapseWidth}
				collapsible
				collapsed={sidebarCollapse}
				onCollapse={onCollapse}
				onBreakpoint={onBreakPoint}
			>
				<Link
					to="/"
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Space align="center">
						{(sidebarCollapse && sidebarCollapseWidth == 1) || (
							<Image
								src="/logo/logo.png"
								alt="logo"
								width={50}
								height={50}
								preview={false}
								style={{marginTop:5}}
							/>
						)}
						{!sidebarCollapse && (
							<Title level={3} style={{ color: colorPrimary }}>
								ระบบ MPS{" "}
							</Title>
						)}
					</Space>
				</Link>
				<Menu
					style={{
						padding: "0 0.3rem",
					}}
					theme="light"
					defaultSelectedKeys={[pathUrl]}
					selectedKeys={selectKeyActive(location.pathname)}
					onClick={({ key }) => {
						navigate(key,{state:{sidebar:true}});
					}}
					openKeys={sidebarActive}
					onOpenChange={onOpenChange}
					mode="inline"
					items={items}
				/>
			</Sider>
			<Layout>
				<SidebarHeader />
				<Content style={{ margin: "0 16px",marginBottom:"70px" }}>
					<Suspense fallback={<EmptyLoading />}>
						<Outlet />
					</Suspense>
					{/* <FloatButton href="/" target="_blank" tooltip={"คู่มือการใช้งาน"} style={{bottom:30}}/> */}
				</Content>
			</Layout>
		</Layout>
	);
};

export default LayoutDashboard;

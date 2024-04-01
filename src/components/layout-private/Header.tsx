import { useState } from "react";
import {
	Button,
	Dropdown,
	Grid,
	Image,
	Layout,
	MenuProps,
	Space,
	theme,
	Tooltip,
	Typography,
} from "antd";
import {
	BgColorsOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	PlusOutlined,
	UserAddOutlined,
	UsergroupAddOutlined,
	LogoutOutlined,
	KeyOutlined,
	UserOutlined,
	BankOutlined,
	BoxPlotOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import useThemeStore from "../../store/themeStore";
import useAuthStore from "../../store/authStore";
import { fallBackImage } from "../../utils/ImageUtils";
import UserForm from "../../pages/user/components/UserForm";
import { useUserImage } from "../../pages/user/hooks/useUser";
import EmployeeForm from "../../pages/employee/components/EmployeeForm";
import OrgForm from "../../pages/org/components/OrgForm";
import MaterialForm from "../../pages/material/components/MaterialForm";
type Props = {};
const { Header } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

export default function SidebarHeader({}: Props) {
	const navigate = useNavigate();
	const [openModalProfile, setOpenModalProfile] = useState(false);
	const [openModalUser, setOpenModalUser] = useState(false);
	const [openModalMaterial, setOpenModalMaterial] = useState(false);
	const [openModalEmployee, setOpenModalEmployee] = useState(false);
	const [openModalOrg, setOpenModalOrg] = useState(false);
	const screens = useBreakpoint();
	const isMobile = screens.sm;
	const {
		token: { colorBgContainer },
	} = theme.useToken();

	const logout = () => {
		resetAuth();
		navigate("/login");
	};

	const [
		themeMode,
		switchThemeMode,
		sidebarCollapse,
		setSidebarCollapse,
		setSidebarCollapseWidth,
	] = useThemeStore((state) => [
		state.themeMode,
		state.switchThemeMode,
		state.sidebarCollapse,
		state.setSidebarCollapse,
		state.setSidebarCollapseWidth,
	]);

	const [user] = useAuthStore((state) => [state.user]);

	const [resetAuth] = useAuthStore((state) => [state.resetAuth]);

	const profile_menu: MenuProps["items"] = [
		{
			key: "1",
			label: (
				<Link to="#" onClick={() => setOpenModalProfile(true)}>
					แก้ไขโปรไฟล์
				</Link>
			),
			icon: <UserOutlined />,
		},
		{
			key: "2",
			label: <Link to="/resetpassword">เปลี่ยนรหัสผ่าน</Link>,
			icon: <KeyOutlined />,
		},
		{
			key: "4",
			danger: true,
			icon: <LogoutOutlined />,
			label: (
				<Link to={"#"} onClick={logout}>
					ออกจากระบบ
				</Link>
			),
		},
	];
	const add_menu: MenuProps["items"] = [
		{
			key: "1",
			label: (
				<Link
					to="/employee"
					onClick={() => {
						setOpenModalEmployee(true);
					}}
				>
					เพิ่มพนักงาน
				</Link>
			),
			icon: <UsergroupAddOutlined />,
		},
		{
			key: "2",
			label: (
				<Link
					to="/material"
					onClick={() => {
						setOpenModalMaterial(true);
					}}
				>
					เพิ่มวัสดุ อุปกรณ์
				</Link>
			),
			icon: <BoxPlotOutlined />,
		},
		{
			key: "3",
			label: (
				<Link
					to="/org"
					onClick={() => {
						setOpenModalOrg(true);
					}}
				>
					เพิ่มหน่วยงาน
				</Link>
			),
			icon: <BankOutlined />,
		},
		{
			key: "4",
			label: (
				<Link
					to="/user"
					onClick={() => {
						setOpenModalUser(true);
					}}
				>
					เพิ่มผู้ใช้
				</Link>
			),
			icon: <UserAddOutlined />,
		},
	];

	return (
		<>
			<Header
				style={{
					padding: 0,
					background: colorBgContainer,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					paddingRight: "1rem",
				}}
			>
				<Space>
					<Button
						type="text"
						icon={
							sidebarCollapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
						}
						onClick={() => {
							setSidebarCollapse(!sidebarCollapse), setSidebarCollapseWidth(1);
						}}
						style={{
							fontSize: "16px",
							width: 64,
							height: 64,
						}}
					/>
					<Dropdown menu={{ items: add_menu }}>
						<Button style={{ display: isMobile ? "flex" : "none" }}>
							<Space size={"small"}>
								<PlusOutlined />
								เพิ่มข้อมูล
							</Space>
						</Button>
					</Dropdown>
				</Space>

				<Space align="center">
					<Tooltip
						title={
							themeMode == "dark"
								? "เปลี่ยนเป็นโหมดสว่าง"
								: "เปลี่ยนเป็นโหมดมืด"
						}
					>
						<Button
							type={themeMode == "dark" ? "default" : "text"}
							size="large"
							icon={<BgColorsOutlined />}
							onClick={switchThemeMode}
						/>
					</Tooltip>

					<Dropdown menu={{ items: profile_menu }}>
						<Space style={{ cursor: "pointer" }}>
							<Image
								preview={false}
								src={useUserImage(user?.image!)}
								style={{
									width: "50px",
									height: "50px",
									objectFit: "cover",
									borderRadius: "50px",
									border: "1px solid #BFBFBF",
								}}
								fallback={fallBackImage}
							/>
							<Text style={{ display: isMobile ? "flex" : "none" }}>
								{user?.first_name} {user?.last_name}
							</Text>
						</Space>
					</Dropdown>
				</Space>
			</Header>
			<UserForm
				rowId={user?.id!}
				onCancel={() => setOpenModalProfile(false)}
				open={openModalProfile}
			/>
			<UserForm
				rowId={0}
				onCancel={() => setOpenModalUser(false)}
				open={openModalUser}
			/>
			<EmployeeForm
				rowId={0}
				onCancel={() => setOpenModalEmployee(false)}
				open={openModalEmployee}
			/>
			<OrgForm
				rowId={0}
				onCancel={() => setOpenModalOrg(false)}
				open={openModalOrg}
			/>
			<MaterialForm
				rowId={0}
				onCancel={() => setOpenModalMaterial(false)}
				open={openModalMaterial}
			/>
		</>
	);
}

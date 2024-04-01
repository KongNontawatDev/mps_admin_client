import {  BankOutlined, CheckCircleOutlined,CodeSandboxOutlined,ControlOutlined,  FileZipOutlined,  HomeOutlined,  InboxOutlined,  UserOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { MenuProps } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[],
	type?: "group"
): MenuItem {
	return {
		key,
		icon,
		children,
		label,
		type,
	} as MenuItem;
}

export const items: MenuItem[] = [
	getItem("หน้าแรก", "/",<HomeOutlined />),
	getItem("รายการขอเบิก / คืน", "/withdraw",<CheckCircleOutlined />),
	getItem("วัสดุ / อุปกรณ", "/material/", <CodeSandboxOutlined />, [
		getItem("วัสดุ / อุปกรณ์ทั้งหมด", "/material",<CodeSandboxOutlined />),
		// getItem("วัสดุ / อุปกรณ์คงคลัง", "/stock",<DropboxOutlined />),
		getItem("ประเภท", "/category",<InboxOutlined />),
		getItem("หน่วยนับ", "/unit",<ControlOutlined />),
	]),
	getItem("จัดการพนักงาน", "/employee",<UsergroupAddOutlined />),
	getItem("จัดการผู้ใช้", "/user",<UserOutlined />),
	getItem("จัดการหน่วยงาน", "/org",<BankOutlined />),
	getItem("รายงาน", "/report",<FileZipOutlined />),
];

export const rootSubmenuKeys = ["history", "basic"];
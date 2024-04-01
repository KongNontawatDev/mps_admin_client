import React, { useEffect, useState } from "react";
import {
	Button,
	Card,
	Col,
	Row,
	TableProps,
	Typography,
	Table,
	PaginationProps,
	Space,
	Image,
	Tooltip,
	notification,
	Flex,
} from "antd";
import { useDebounce } from "use-debounce";
import {
	ClearOutlined,
	DeleteOutlined,
	EditOutlined,
	FilterOutlined,
	PlusOutlined,
	UserOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { SorterResult } from "antd/es/table/interface";

import useAuthStore from "../../store/authStore";
import useUserStore from "../../store/userStore";
import { fallBackImage } from "../../utils/ImageUtils";
import BreadcrumbLink from "../../components/shared/BreadcrumbLink";
import { PaginationTable } from "../../components/shared/PaginationTable";
import BadgeUserLevel from "../../components/shared/BadgeUserLevel";
import PopconfirmDelete from "../../components/shared/PopconfirmDelete";
import DropdownFilter from "../../components/shared/DropdownFilter";
import UserForm from "./components/UserForm";
import { useLocation, useSearchParams } from "react-router-dom";
import { ellipsis } from "../../utils/myFunction";
import Inputtextfilter from "../../components/shared/InputTextfilter";
import type { User, UserConditionSearch } from "../../services/types/UserType";
import { useUserImage, useUsers } from "./hooks/useUser";
import { useUserDelete } from "./hooks/useUserMutate";

const { Title, Text } = Typography;

type Props = {};
const pageTitle = "จัดการผู้ใช้";
const listItems = [{ title: pageTitle }];

export default function User({}: Props) {
	const [accessToken] = useAuthStore((state) => [state.accessToken]);
	const UserStore = useUserStore((state) => state);
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const {
		page,
		searchState,
		level,
		resetUserFilter,
		setUserFilter,
		textfilter,
	} = UserStore;

	const [sortedInfo, setSortedInfo] = useState<SorterResult<User>>({});
	const [rowId, setRowId] = useState(0);
	const [openModal, setOpenModal] = useState(false);

	const [debounce] = useDebounce(textfilter, 700);
	const setCondition = () => {
		const condition: UserConditionSearch = {
			sortorder: sortedInfo.order!,
			sortfield: sortedInfo.field?.toString()!,
			page: page,
			textfilter: textfilter,
			level: Number(level),
		};
		return condition;
	};

	const initSort: SorterResult<User> = {
		field: "",
		order: "descend",
	};

	const requestCondition: UserConditionSearch = setCondition();
	const { data, isLoading, setFilter } = useUsers(
		requestCondition,
		accessToken
	);
	const UserDelete = useUserDelete(accessToken);

	useEffect(() => {
		onFilter();
	}, [debounce, page, sortedInfo.order, sortedInfo.field, level]);

	useEffect(() => {
		if (searchParams.get("openModalAdd")) {
			setOpenModal(true);
			setRowId(0);
			searchParams.set("openModalAdd", "");
		}
	}, []);

	useEffect(() => {
		if (location.state?.sidebar) {
			setSortedInfo(initSort);
			setUserFilter({
				...UserStore,
				page: 1,
			});
		}
	}, []);

	const onFilter = () => {
		setFilter(setCondition());
	};

	const onClearFilter = () => {
		resetUserFilter();
	};

	const textfilterDebounced = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserFilter({
			...UserStore,
			textfilter: e.target.value,
			page: 1,
		});
	};

	const onChange: TableProps<User>["onChange"] = (
		{},
		{},
		sorter,
		extra
	) => {
		if (extra.action == "sort") {
			const sort = sorter as SorterResult<User>;
			if (sort.order == undefined) {
				setSortedInfo(initSort);
			} else {
				setSortedInfo(sort);
			}
			setUserFilter({
				...UserStore,
				page: 1,
			});
		}
	};

	const handleDelete = async (id: number) => {
		await UserDelete.mutateAsync(id).then(() => {
			notification.open({
				message: "ลบข้อมูลสำเร็จ",
				type: "success",
			});
		});
	};

	const onChangePagination: PaginationProps["onChange"] = (page) => {
		setUserFilter({
			...UserStore,
			page: page,
		});
	};

	const onChangeLevelFilter = (value: string) => {
		if (value) {
			setUserFilter({
				...UserStore,
				level: value,
				page: 1,
			});
		} else {
			setUserFilter({
				...UserStore,
				level: "",
				page: 1,
			});
		}
	};

	return (
		<>
			<UserForm
				rowId={rowId}
				onCancel={() => setOpenModal(false)}
				open={openModal}
			/>
			<Row align={"middle"} style={{ marginTop: "15px" }}>
				<Col sm={12}>
					<Title level={4} style={{ margin: "10px 0 5px" }}>
						<UserOutlined /> {pageTitle}
					</Title>
				</Col>
				<Col sm={12}>
					<BreadcrumbLink listItems={listItems} />
				</Col>
			</Row>
			<Card>

				<Row justify={"space-between"} gutter={[10, 10]}>
					<Col span={24} lg={18} md={{ order: 1, span: 16 }} order={2}>
						<Row gutter={10}>
							<Col span={24} md={12} lg={8}>
								{!searchState || (
									<Inputtextfilter
										placeholder="ค้นหา ชื่อผู้ใช้, ชื่อ-สกุล"
										value={textfilter}
										onSearch={onFilter}
										onChange={textfilterDebounced}
										onPressEnter={onFilter}
									/>
								)}
							</Col>

							<Col span={24} md={8} lg={4}>
								{!searchState || (
									<DropdownFilter
									onChange={onChangeLevelFilter}
									options={[
										{ value: "1", label: "Super" },
										{ value: "2", label: "Admin" },
									]}
									value={level}
									placeholder="เลือกระดับผู้ใช้"
									name="dropdown-filter-level"
								/>
								)}
							</Col>
						</Row>
					</Col>
					<Col span={24} lg={6} md={{ order: 2, span: 8 }} order={1}>
						<Flex justify="end" wrap="nowrap" gap={10}>
							<Tooltip title="ล้างการค้นหา">
								<Button
									type="text"
									onClick={onClearFilter}
									icon={<ClearOutlined />}
								></Button>
							</Tooltip>
							<Tooltip title="ปิดตัวค้นหา">
								<Button
									type={searchState ? "text" : "default"}
									onClick={() =>
										setUserFilter({
											...UserStore,
											searchState: !searchState,
										})
									}
									icon={<FilterOutlined />}
								/>
							</Tooltip>

							<Button
								type="primary"
								icon={<PlusOutlined />}
								onClick={()=>{setOpenModal(true),setRowId(0)}}
							>
								เพิ่มผู้ใช้
							</Button>
						</Flex>
					</Col>
				</Row>

				<Table
					columns={[
						{
							title: "ID",
							dataIndex: "id",
							key: "id",
							align: "center",
							width: 70,
							sorter: true,
							sortOrder: sortedInfo.field === "id" ? sortedInfo.order : null,
							render: (_, { id }) => <>{ellipsis(id)}</>,
						},
						{
							title: "",
							dataIndex: "image",
							key: "image",
							width: 80,
							align: "center",
							render: (_, { image }) => (
								<Image
									src={useUserImage(image)}
									width={70}
									height={70}
									fallback={fallBackImage}
									style={{ borderRadius: "50px", objectFit: "cover" }}
								/>
							),
						},
						{
							title: "ชื่อ - สกุล",
							dataIndex: "first_name",
							sorter: true,
							sortOrder:
								sortedInfo.field === "first_name" ? sortedInfo.order : null,
							render: (_, { first_name, last_name, id }) => (
								<Text
									onClick={() => {
										setRowId(id), setOpenModal(true);
									}}
									style={{ cursor: "pointer" }}
								>
									<Highlighter
										searchWords={[textfilter]}
										textToHighlight={`${first_name} ${last_name}`}
									/>
								</Text>
							),
						},
						{
							title: "ชื่อผู้ใช้",
							dataIndex: "user_name",
							key: "user_name",
							sorter: true,
							responsive: ["md"],
							sortOrder:
								sortedInfo.field === "user_name" ? sortedInfo.order : null,
							render: (_, { user_name }) => (
								<Highlighter
									searchWords={[textfilter]}
									textToHighlight={user_name}
								/>
							),
						},
						{
							title: "อีเมล",
							dataIndex: "email",
							key: "email",
							sorter: true,
							responsive: ["lg"],
							sortOrder: sortedInfo.field === "email" ? sortedInfo.order : null,
						},
						{
							title: "ระดับผู้ใช้",
							dataIndex: "level",
							key: "level",
							sorter: true,
							align: "center",
							sortOrder: sortedInfo.field === "level" ? sortedInfo.order : null,
							render: (_, { level }) => <BadgeUserLevel user_level={level!} />,
						},
						{
							title: "",
							key: "action",
							align: "right",
							width: 90,
							render: (_, { id, level, user_name }) => (
								<Space>
									<Tooltip title="แก้ไขข้อมูล" placement="bottom">
										<Button
											icon={<EditOutlined />}
											type="text"
											onClick={() => {
												setRowId(id), setOpenModal(true);
											}}
										/>
									</Tooltip>
									<PopconfirmDelete
										onConfirm={() => handleDelete(id)}
										title={user_name}
										disabled={level == 1}
									>
										<Tooltip title="ลบข้อมูล" placement="bottom">
											<Button
												icon={<DeleteOutlined />}
												type="text"
												disabled={level == 1}
											/>
										</Tooltip>
									</PopconfirmDelete>
								</Space>
							),
						},
					]}
					loading={isLoading}
					dataSource={data?.results}
					onChange={onChange}
					rowKey="id"
					bordered
					style={{ minHeight: "500px", overflowX: "auto" }}
					locale={{
						triggerDesc: "เรียงจากมากไปน้อย",
						triggerAsc: "เรียงจากน้อยไปมาก",
						cancelSort: "ยกเลิกการจัดเรียง",
					}}
					pagination={false}
				/>
				<PaginationTable
					current={page}
					onChange={onChangePagination}
					total={data?.totalItem}
					totalItem={data?.totalItem}
					totalRecord={data?.totalRecord}
				/>
			</Card>
		</>
	);
}

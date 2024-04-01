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
	Tag,
	Switch,
} from "antd";
import { useDebounce } from "use-debounce";
import {
	ClearOutlined,
	DeleteOutlined,
	EditOutlined,
	FilterOutlined,
	ManOutlined,
	PlusOutlined,
	UsergroupAddOutlined,
	WomanOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { SorterResult } from "antd/es/table/interface";

import useAuthStore from "../../store/authStore";
import useEmployeeStore from "../../store/employeeStore";
import { fallBackImage } from "../../utils/ImageUtils";
import BreadcrumbLink from "../../components/shared/BreadcrumbLink";
import { PaginationTable } from "../../components/shared/PaginationTable";
import PopconfirmDelete from "../../components/shared/PopconfirmDelete";
import DropdownFilter from "../../components/shared/DropdownFilter";
import EmployeeForm from "./components/EmployeeForm";
import { useLocation, useSearchParams } from "react-router-dom";
import { ellipsis } from "../../utils/myFunction";
import Inputtextfilter from "../../components/shared/InputTextfilter";
import type {
	Employee,
	EmployeeConditionSearch,
} from "../../services/types/EmployeeType";
import { useEmployeeImage, useEmployees } from "./hooks/useEmployee";
import { useEmployeeDelete, useEmployeeUpdate } from "./hooks/useEmployeeMutate";
import { useOrgOptions } from "../org/hooks/useOrg";

const { Title, Text } = Typography;

type Props = {};
const pageTitle = "จัดการพนักงาน";
const listItems = [{ title: pageTitle }];

export default function Employee({}: Props) {
	const [accessToken] = useAuthStore((state) => [state.accessToken]);
	const EmployeeStore = useEmployeeStore((state) => state);
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const {
		page,
		searchState,
		resetEmployeeFilter,
		setEmployeeFilter,
		textfilter,
		status,
		org_id,
		gender,
	} = EmployeeStore;

	const [sortedInfo, setSortedInfo] = useState<SorterResult<Employee>>({});
	const [rowId, setRowId] = useState(0);
	const [openModal, setOpenModal] = useState(false);

	const [debounce] = useDebounce(textfilter, 700);
	const setCondition = () => {
		const condition: EmployeeConditionSearch = {
			sortorder: sortedInfo.order!,
			sortfield: sortedInfo.field?.toString()!,
			page: page,
			textfilter: textfilter,
			status: Number(status),
			org_id: Number(org_id),
			gender: gender,
		};
		return condition;
	};

	const initSort: SorterResult<Employee> = {
		field: "",
		order: "descend",
	};

	const requestCondition: EmployeeConditionSearch = setCondition();
	const { data, isLoading, setFilter } = useEmployees(
		requestCondition,
		accessToken
	);
	const EmployeeDelete = useEmployeeDelete(accessToken);
	const EmployeeUpdate = useEmployeeUpdate(accessToken);
		const OrgOption = useOrgOptions(accessToken);
	useEffect(() => {
		onFilter();
	}, [
		debounce,
		page,
		sortedInfo.order,
		sortedInfo.field,
		status,
		gender,
		org_id,
	]);

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
			setEmployeeFilter({
				...EmployeeStore,
				page: 1,
			});
		}
	}, []);

	const onFilter = () => {
		setFilter(setCondition());
	};

	const onClearFilter = () => {
		resetEmployeeFilter();
	};

	const textfilterDebounced = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmployeeFilter({
			...EmployeeStore,
			textfilter: e.target.value,
			page: 1,
		});
	};

	const onChange: TableProps<Employee>["onChange"] = (
		{},
		{},
		sorter,
		extra
	) => {
		if (extra.action == "sort") {
			const sort = sorter as SorterResult<Employee>;
			if (sort.order == undefined) {
				setSortedInfo(initSort);
			} else {
				setSortedInfo(sort);
			}
			setEmployeeFilter({
				...EmployeeStore,
				page: 1,
			});
		}
	};

	const handleDelete = async (id: number) => {
		await EmployeeDelete.mutateAsync(id).then(() => {
			notification.open({
				message: "ลบข้อมูลสำเร็จ",
				type: "success",
			});
		});
	};

	const onChangePagination: PaginationProps["onChange"] = (page) => {
		setEmployeeFilter({
			...EmployeeStore,
			page: page,
		});
	};

		const handleUpdateStatus = async (id: number, status: number) => {
		await EmployeeUpdate.mutateAsync({ id, status });
	};

	const onChangeOrgFilter = (value: number) => {
		if (value) {
			setEmployeeFilter({
				...EmployeeStore,
				org_id: Number(value),
				page: 1,
			});
		} else {
			setEmployeeFilter({
				...EmployeeStore,
				org_id: 0,
				page: 1,
			});
		}
	};

	const onChangeStatusFilter = (value: number) => {
		if (value) {
			setEmployeeFilter({
				...EmployeeStore,
				status: Number(value),
				page: 1,
			});
		} else {
			setEmployeeFilter({
				...EmployeeStore,
				status: 0,
				page: 1,
			});
		}
	};

	const onChangeGenderFilter = (value: string) => {
		if (value) {
			setEmployeeFilter({
				...EmployeeStore,
				gender: value,
				page: 1,
			});
		} else {
			setEmployeeFilter({
				...EmployeeStore,
				gender: "",
				page: 1,
			});
		}
	};

	return (
		<>
			<EmployeeForm
				rowId={rowId}
				onCancel={() => setOpenModal(false)}
				open={openModal}
			/>
			<Row align={"middle"} style={{ marginTop: "15px" }}>
				<Col sm={12}>
					<Title level={4} style={{ margin: "10px 0 5px" }}>
						<UsergroupAddOutlined /> {pageTitle}
					</Title>
				</Col>
				<Col sm={12}>
					<BreadcrumbLink listItems={listItems} />
				</Col>
			</Row>
			<Card>
				<Row justify={"space-between"} gutter={[10, 10]}>
					<Col span={24} lg={20} md={{ order: 1, span: 20 }} order={2}>
						<Row gutter={10}>
							<Col span={24} md={12} lg={6}>
								{!searchState || (
									<Inputtextfilter
										placeholder="ค้นหา ชื่อ-สกุล"
										value={textfilter}
										onSearch={onFilter}
										onChange={textfilterDebounced}
										onPressEnter={onFilter}
									/>
								)}
							</Col>
							<Col span={24} md={12} lg={6}>
							{!searchState || (<DropdownFilter
								onChange={onChangeOrgFilter}
								options={OrgOption.data}
								value={org_id}
								placeholder="เลือกหน่วยงาน"
								fieldLabel="name"
								fieldValue="id"
								name="dropdown-filter-org"
							/>)}
						</Col>
						<Col span={24} md={12} lg={4}>
							{!searchState || (<DropdownFilter
								onChange={onChangeStatusFilter}
								options={[
									{ value:1 , label: "ทำงานอยู่" },
									{ value:2 , label: "ไม่ได้ทำงานแล้ว" },
								]}
							value={status}
								placeholder="เลือกสถานะ"
								name="dropdown-filter-status"
							/>)}
						</Col>
						<Col span={24} md={12} lg={4}>
							{!searchState || (<DropdownFilter
								onChange={onChangeGenderFilter}
								options={[
									{ value: "ชาย", label: "ชาย" },
									{ value: "หญิง", label: "หญิง" },
								]}
								value={gender}
								placeholder="เลือกเพศ"
								name="dropdown-filter-level"
							/>)}
						</Col>
						</Row>
					</Col>
					<Col span={24} lg={4} md={{ order: 2, span: 4 }} order={1}>
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
										setEmployeeFilter({
											...EmployeeStore,
											searchState: !searchState,
										})
									}
									icon={<FilterOutlined />}
								/>
							</Tooltip>

							<Button
								type="primary"
								icon={<PlusOutlined />}
								onClick={() => {
									setOpenModal(true), setRowId(0);
								}}
							>
								เพิ่มพนักงาน
							</Button>
						</Flex>
					</Col>
				</Row>

				<Table
					columns={[
						{
							title: "ID",
							dataIndex: "id",
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
									src={useEmployeeImage(image)}
									width={70}
									height={70}
									fallback={fallBackImage}
									style={{ objectFit: "cover" }}
								/>
							),
						},
						{
							title: "ชื่อ - สกุล",
							dataIndex: "first_name",
							sorter: true,
							sortOrder:
								sortedInfo.field === "first_name" ? sortedInfo.order : null,
							render: (_, { first_name, last_name, id, gender }) => (
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

									{gender == "ชาย" ? (
										<Tag color="blue" style={{marginLeft:10}}>
											<ManOutlined /> ชาย
										</Tag>
									) : (
										<Tag color="pink"  style={{marginLeft:10}}>
											<WomanOutlined /> หญิง
										</Tag>
									)}
								</Text>
							),
						},
						{
							title: "หน่วยงาน",
							dataIndex: "org_id",
							key: "org_id",
							sorter: true,
							responsive: ["lg"],
							sortOrder:
								sortedInfo.field === "org_id" ? sortedInfo.order : null,
							render: (_, { org: { name } }) => <>{name}</>,
						},
						{
							title: "ตำแหน่ง",
							dataIndex: "position",
							key: "position",
							sorter: true,
							responsive: ["lg"],
							sortOrder:
								sortedInfo.field === "position" ? sortedInfo.order : null,
						},

						{
							title: "เบอร์โทร",
							dataIndex: "tel",
							key: "tel",
							sorter: true,
							responsive: ["lg"],
							sortOrder: sortedInfo.field === "tel" ? sortedInfo.order : null,
						},
						{
							title: "สถานะ",
							key: "status",
							align: "center",
							width: 90,
							render: (_, { id, status }) => (
								<Tooltip title="ทำงานอยู่ / ไม่ได้ทำงานแล้ว">
									<Switch
										checkedChildren="ทำอยู่"
										unCheckedChildren="ไม่"
										checked={status === 1 && true}
										onChange={(e) => handleUpdateStatus(id, e ? 1 : 2)}
									/>
								</Tooltip>
							),
						},
						{
							title: "",
							key: "action",
							align: "right",
							width: 90,
							render: (_, { id, first_name }) => (
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
										title={first_name}
									>
										<Tooltip title="ลบข้อมูล" placement="bottom">
											<Button icon={<DeleteOutlined />} type="text" />
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

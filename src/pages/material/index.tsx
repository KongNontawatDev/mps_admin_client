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
	Switch,
	Select,
} from "antd";
import { useDebounce } from "use-debounce";
import {
	ClearOutlined,
	CodeSandboxOutlined,
	DeleteOutlined,
	EditOutlined,
	FilterOutlined,
	PlusCircleOutlined,
	PlusOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { SorterResult } from "antd/es/table/interface";

import useAuthStore from "../../store/authStore";
import useMaterialStore from "../../store/materialStore";
import { fallBackImage } from "../../utils/ImageUtils";
import BreadcrumbLink from "../../components/shared/BreadcrumbLink";
import { PaginationTable } from "../../components/shared/PaginationTable";
import PopconfirmDelete from "../../components/shared/PopconfirmDelete";
import MaterialForm from "./components/MaterialForm";
import { useLocation, useSearchParams } from "react-router-dom";
import Inputtextfilter from "../../components/shared/InputTextfilter";
import type {
	Material,
	MaterialConditionSearch,
} from "../../services/types/MaterialType";
import { useMaterialImage, useMaterials } from "./hooks/useMaterial";
import {
	useMaterialDelete,
	useMaterialUpdatePublish,
	useMaterialUpdateStatus,
} from "./hooks/useMaterialMutate";
import { centimetersToMeters } from "../../utils/numberFormat";
import StockForm from "./components/StockForm";

const { Title, Text } = Typography;

type Props = {};
const pageTitle = "จัดการวัสดุ/อุปกรณ์";
const listItems = [{ title: pageTitle }];

export default function Material({}: Props) {
	const [accessToken] = useAuthStore((state) => [state.accessToken]);
	const MaterialStore = useMaterialStore((state) => state);
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const {
		page,
		searchState,
		resetMaterialFilter,
		setMaterialFilter,
		textfilter,
	} = MaterialStore;

	const [sortedInfo, setSortedInfo] = useState<SorterResult<Material>>({});
	const [rowId, setRowId] = useState(0);
	const [openModal, setOpenModal] = useState(false);
	const [openModalStock, setOpenModalStock] = useState(false);

	const [debounce] = useDebounce(textfilter, 700);
	const setCondition = () => {
		const condition: MaterialConditionSearch = {
			sortorder: sortedInfo.order!,
			sortfield: sortedInfo.field?.toString()!,
			page: page,
			textfilter: textfilter,
		};
		return condition;
	};

	const initSort: SorterResult<Material> = {
		field: "",
		order: "descend",
	};

	const requestCondition: MaterialConditionSearch = setCondition();
	const { data, isLoading, setFilter } = useMaterials(
		requestCondition,
		accessToken
	);
	const MaterialDelete = useMaterialDelete(accessToken);
	const EmployeeUpdateStatus = useMaterialUpdateStatus(accessToken);
	const EmployeeUpdatePublish = useMaterialUpdatePublish(accessToken);

	useEffect(() => {
		onFilter();
	}, [debounce, page, sortedInfo.order, sortedInfo.field]);

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
			setMaterialFilter({
				...MaterialStore,
				page: 1,
			});
		}
	}, []);

	const onFilter = () => {
		setFilter(setCondition());
	};

	const onClearFilter = () => {
		resetMaterialFilter();
	};

	const textfilterDebounced = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMaterialFilter({
			...MaterialStore,
			textfilter: e.target.value,
			page: 1,
		});
	};

	const onChange: TableProps<Material>["onChange"] = (
		{},
		{},
		sorter,
		extra
	) => {
		if (extra.action == "sort") {
			const sort = sorter as SorterResult<Material>;
			if (sort.order == undefined) {
				setSortedInfo(initSort);
			} else {
				setSortedInfo(sort);
			}
			setMaterialFilter({
				...MaterialStore,
				page: 1,
			});
		}
	};

	const handleDelete = async (id: number) => {
		await MaterialDelete.mutateAsync(id).then(() => {
			notification.open({
				message: "ลบข้อมูลสำเร็จ",
				type: "success",
			});
		});
	};

	const onChangePagination: PaginationProps["onChange"] = (page) => {
		setMaterialFilter({
			...MaterialStore,
			page: page,
		});
	};

	const handleUpdateStatus = async (id: number, status: number) => {
		await EmployeeUpdateStatus.mutateAsync({ id, status });
	};

	const handleUpdatePublish = async (id: number, publish: number) => {
		await EmployeeUpdatePublish.mutateAsync({ id, publish });
	};

	return (
		<>
			<MaterialForm
				rowId={rowId}
				onCancel={() => setOpenModal(false)}
				open={openModal}
			/>
			<StockForm
				rowId={rowId}
				onCancel={() => setOpenModalStock(false)}
				open={openModalStock}
			/>
			<Row align={"middle"} style={{ marginTop: "15px" }}>
				<Col sm={12}>
					<Title level={4} style={{ margin: "10px 0 5px" }}>
						<CodeSandboxOutlined /> {pageTitle}
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

							{/* <Col span={24} md={8} lg={4}>
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
							</Col> */}
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
										setMaterialFilter({
											...MaterialStore,
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
								เพิ่มวัสดุอุปกรณ์
							</Button>
						</Flex>
					</Col>
				</Row>

				<Table
					columns={[
						{
							title: "SKU",
							dataIndex: "sku",
							key: "sku",
							align: "center",
							width: 70,
							sorter: true,
							sortOrder: sortedInfo.field === "id" ? sortedInfo.order : null,
							render: (_, { sku }) => <>{sku}</>,
						},
						{
							title: "",
							dataIndex: "image",
							key: "image",
							width: 80,
							align: "center",
							render: (_, { image }) => (
								<Image
									src={useMaterialImage(image)}
									width={70}
									height={70}
									fallback={fallBackImage}
									style={{ objectFit: "cover" }}
								/>
							),
						},
						{
							title: "ชื่อวัสดุ/อุปกรณ์",
							dataIndex: "name",
							sorter: true,
							sortOrder: sortedInfo.field === "name" ? sortedInfo.order : null,
							render: (_, { name, id, width, weight, height }) => (
								<>
									<Text
										onClick={() => {
											setRowId(id), setOpenModal(true);
										}}
										style={{ cursor: "pointer" }}
									>
										<Highlighter
											searchWords={[textfilter]}
											textToHighlight={`${name}`}
										/>
									</Text>{" "}
									<br />
									<Text type="secondary">
										กว้าว {centimetersToMeters(width)} : ยาว{" "}
										{centimetersToMeters(height)} : น้ำหนัก{" "}
										{weight ? weight : "-"} กก.
									</Text>
								</>
							),
						},
						{
							title: "ประเภท",
							dataIndex: "cat_id",
							key: "cat_id",
							sorter: true,
							responsive: ["lg"],
							sortOrder:
								sortedInfo.field === "cat_id" ? sortedInfo.order : null,
							render: (_, { category: { name } }) => <>{name}</>,
						},
						{
							title: "คงเหลือ",
							dataIndex: "stock",
							key: "stock",
							sorter: true,
							responsive: ["lg"],
							sortOrder: sortedInfo.field === "stock" ? sortedInfo.order : null,
							render: (_, { stock }) => <>{stock}</>,
						},
						{
							title: "หน่วยนับ",
							dataIndex: "unit",
							key: "unit",
							sorter: true,
							responsive: ["lg"],
							sortOrder: sortedInfo.field === "unit" ? sortedInfo.order : null,
							render: (_, { unit }) => <>{unit}</>,
						},
						{
							title: "สถานะ",
							key: "status",
							align: "center",
							width: 90,
							render: (_, { id, status }) => (
								<Tooltip title="วัสดุพร้อมเบิก / หมด">
									<Select
										value={status}
										style={{
											width: 110,
											backgroundColor: status == 2 ? "#EA5455" : "#DCF6E8",
											borderRadius: 8,
										}}
										onChange={(e: any) => handleUpdateStatus(id, e)}
										options={[
											{ value: 1, label: "พร้อมเบิก" },
											{ value: 2, label: "หมด" },
										]}
										variant="borderless"
									/>
								</Tooltip>
							),
						},
						{
							title: "การมองเห็น",
							key: "publish",
							align: "center",
							width: 120,
							render: (_, { id, publish }) => (
								<Tooltip title="เปิดการมองเห็น / ปิดการมองเห็น">
									<Switch
										checkedChildren="เปิด"
										unCheckedChildren="ปิด"
										checked={publish === 1 && true}
										onChange={(e) => handleUpdatePublish(id, e ? 1 : 2)}
									/>
								</Tooltip>
							),
						},
						{
							title: "",
							key: "action",
							align: "right",
							width: 90,
							render: (_, { id, name }) => (
								<Space>
									<Tooltip title="เพิ่มสต๊อก" placement="bottom">
										<Button
											icon={<PlusCircleOutlined />}
											type="text"
											onClick={() => {
												setRowId(id), setOpenModalStock(true);
											}}
										/>
									</Tooltip>
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
										title={name}
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

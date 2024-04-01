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
	Tooltip,
	notification,
	Flex,
} from "antd";
import { useDebounce } from "use-debounce";
import {
	ClearOutlined,
	ControlOutlined,
	DeleteOutlined,
	EditOutlined,
	FilterOutlined,
	PlusOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { SorterResult } from "antd/es/table/interface";
import { useLocation, useSearchParams } from "react-router-dom";

import useAuthStore from "../../store/authStore";
import useUnitStore from "../../store/unitStore";
import BreadcrumbLink from "../../components/shared/BreadcrumbLink";
import Inputtextfilter from "../../components/shared/InputTextfilter";
import { PaginationTable } from "../../components/shared/PaginationTable";
import PopconfirmDelete from "../../components/shared/PopconfirmDelete";
import UnitForm from "./components/UnitForm";
import { ellipsis } from "../../utils/myFunction";
import type { Unit, UnitConditionSearch } from "../../services/types/UnitType";
import { useUnits } from "./hooks/useUnit";
import { useUnitDelete } from "./hooks/useUnitMutate";

const { Title, Text } = Typography;

type Props = {};
const pageTitle = "จัดการหน่วยนับ";
const listItems = [{ title: pageTitle }];

export default function Unit({}: Props) {
	const [accessToken] = useAuthStore((state) => [state.accessToken]);
	const [searchParams] = useSearchParams();
	const location = useLocation();
	const UnitStore = useUnitStore((state) => state);
	const { page, searchState, resetUnitFilter, setUnitFilter, textfilter } =
		UnitStore;

	const [sortedInfo, setSortedInfo] = useState<SorterResult<Unit>>({});
	const [rowId, setRowId] = useState(0);
	const [openModal, setOpenModal] = useState(false);

	const [debounce] = useDebounce(textfilter, 700);
	const setCondition = () => {
		const condition: UnitConditionSearch = {
			sortorder: sortedInfo.order!,
			sortfield: sortedInfo.field?.toString()!,
			page: page,
			textfilter: textfilter,
		};
		return condition;
	};

	const initSort: SorterResult<Unit> = {
		field: "",
		order: "descend",
	};

	const requestCondition: UnitConditionSearch = setCondition();
	const { data, isLoading, setFilter } = useUnits(
		requestCondition,
		accessToken
	);
	const UnitDelete = useUnitDelete(accessToken);

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
			setUnitFilter({
				...UnitStore,
				page: 1,
			});
		}
	}, []);

	const onFilter = () => {
		setFilter(setCondition());
	};

	const onClearFilter = () => {
		resetUnitFilter();
	};

	const textfilterDebounced = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUnitFilter({
			...UnitStore,
			textfilter: e.target.value,
			page: 1,
		});
	};

	const onChange: TableProps<Unit>["onChange"] = ({}, {}, sorter, extra) => {
		if (extra.action == "sort") {
			const sort = sorter as SorterResult<Unit>;
			if (sort.order == undefined) {
				setSortedInfo(initSort);
			} else {
				setSortedInfo(sort);
			}
			setUnitFilter({
				...UnitStore,
				page: 1,
			});
		}
	};

	const handleDelete = async (id: number) => {
		await UnitDelete.mutateAsync(id).then(() => {
			notification.open({
				message: "ลบข้อมูลสำเร็จ",
				type: "success",
			});
		});
	};

	const onChangePagination: PaginationProps["onChange"] = (page) => {
		setUnitFilter({
			...UnitStore,
			page: page,
		});
	};

	return (
		<>
			<UnitForm
				rowId={rowId}
				onCancel={() => setOpenModal(false)}
				open={openModal}
			/>
			<Row align={"middle"} style={{ marginTop: "15px" }}>
				<Col sm={12}>
					<Title level={4} style={{ margin: "10px 0 5px" }}>
						<ControlOutlined /> {pageTitle}
					</Title>
				</Col>
				<Col sm={12}>
					<BreadcrumbLink listItems={listItems} />
				</Col>
			</Row>
			<Card>
					<Row justify={"space-between"} gutter={[10, 10]}>
						<Col span={24} md={12} lg={8}>
							{!searchState || (<Inputtextfilter
								placeholder="ค้นหา ชื่อหน่วยนับ"
								value={textfilter}
								onSearch={onFilter}
								onChange={textfilterDebounced}
								onPressEnter={onFilter}
							/>)}
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
											setUnitFilter({
												...UnitStore,
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
									เพิ่มหน่วยนับ
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
							title: "ชื่อหน่วยนับ",
							dataIndex: "name",
							sorter: true,
							sortOrder: sortedInfo.field === "name" ? sortedInfo.order : null,
							render: (_, { name, id }) => (
								<Text
									onClick={() => {
										setRowId(id), setOpenModal(true);
									}}
									style={{ cursor: "pointer" }}
								>
									<Highlighter
										searchWords={[textfilter]}
										textToHighlight={name}
									/>
								</Text>
							),
						},
						{
							title: "",
							key: "action",
							align: "right",
							width: 90,
							render: (_, { id, name }) => (
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

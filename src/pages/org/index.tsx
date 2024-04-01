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
	BankOutlined,
	ClearOutlined,
	DeleteOutlined,
	EditOutlined,
	FilterOutlined,
	PlusOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { SorterResult } from "antd/es/table/interface";
import { useLocation, useSearchParams } from "react-router-dom";

import useAuthStore from "../../store/authStore";
import useOrgStore from "../../store/orgStore";
import BreadcrumbLink from "../../components/shared/BreadcrumbLink";
import Inputtextfilter from "../../components/shared/InputTextfilter";
import { PaginationTable } from "../../components/shared/PaginationTable";
import PopconfirmDelete from "../../components/shared/PopconfirmDelete";
import OrgForm from "./components/OrgForm";
import { ellipsis } from "../../utils/myFunction";
import type { Org, OrgConditionSearch } from "../../services/types/OrgType";
import { useOrgs } from "./hooks/useOrg";
import { useOrgDelete } from "./hooks/useOrgMutate";

const { Title, Text } = Typography;

type Props = {};
const pageTitle = "จัดการหน่วยงาน";
const listItems = [{ title: pageTitle }];

export default function Org({}: Props) {
	const [accessToken] = useAuthStore((state) => [state.accessToken]);
	const [searchParams] = useSearchParams();
	const location = useLocation();
	const OrgStore = useOrgStore((state) => state);
	const { page, searchState, resetOrgFilter, setOrgFilter, textfilter } =
		OrgStore;

	const [sortedInfo, setSortedInfo] = useState<SorterResult<Org>>({});
	const [rowId, setRowId] = useState(0);
	const [openModal, setOpenModal] = useState(false);

	const [debounce] = useDebounce(textfilter, 700);
	const setCondition = () => {
		const condition: OrgConditionSearch = {
			sortorder: sortedInfo.order!,
			sortfield: sortedInfo.field?.toString()!,
			page: page,
			textfilter: textfilter,
		};
		return condition;
	};

	const initSort: SorterResult<Org> = {
		field: "",
		order: "descend",
	};

	const requestCondition: OrgConditionSearch = setCondition();
	const { data, isLoading, setFilter } = useOrgs(requestCondition, accessToken);
	const OrgDelete = useOrgDelete(accessToken);

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
			setOrgFilter({
				...OrgStore,
				page: 1,
			});
		}
	}, []);

	const onFilter = () => {
		setFilter(setCondition());
	};

	const onClearFilter = () => {
		resetOrgFilter();
	};

	const textfilterDebounced = (e: React.ChangeEvent<HTMLInputElement>) => {
		setOrgFilter({
			...OrgStore,
			textfilter: e.target.value,
			page: 1,
		});
	};

	const onChange: TableProps<Org>["onChange"] = ({}, {}, sorter, extra) => {
		if (extra.action == "sort") {
			const sort = sorter as SorterResult<Org>;
			if (sort.order == undefined) {
				setSortedInfo(initSort);
			} else {
				setSortedInfo(sort);
			}
			setOrgFilter({
				...OrgStore,
				page: 1,
			});
		}
	};

	const handleDelete = async (id: number) => {
		await OrgDelete.mutateAsync(id).then(() => {
			notification.open({
				message: "ลบข้อมูลสำเร็จ",
				type: "success",
			});
		});
	};

	const onChangePagination: PaginationProps["onChange"] = (page) => {
		setOrgFilter({
			...OrgStore,
			page: page,
		});
	};

	return (
		<>
			<OrgForm
				rowId={rowId}
				onCancel={() => setOpenModal(false)}
				open={openModal}
			/>
			<Row align={"middle"} style={{ marginTop: "15px" }}>
				<Col sm={12}>
					<Title level={4} style={{ margin: "10px 0 5px" }}>
						<BankOutlined /> {pageTitle}
					</Title>
				</Col>
				<Col sm={12}>
					<BreadcrumbLink listItems={listItems} />
				</Col>
			</Row>
			<Card>
				<Row justify={"space-between"} gutter={[10, 10]}>
					<Col span={24} md={12} lg={8}>
						{!searchState || (
							<Inputtextfilter
								placeholder="ค้นหา ชื่อหน่วยนับ"
								value={textfilter}
								onSearch={onFilter}
								onChange={textfilterDebounced}
								onPressEnter={onFilter}
							/>
						)}
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
										setOrgFilter({
											...OrgStore,
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
								เพิ่มหน่วยงาน
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
							title: "ชื่อหน่วยงาน",
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
							title: "ที่อยู่",
							dataIndex: "address",
							key: "address",
							render: (_, { address, province, amphure, district }) => (
								<>
									<Highlighter
										searchWords={[textfilter]}
										textToHighlight={address}
									/>
									<Text
										style={{ display: "block" }}
										type="secondary"
									>{`ต.${district} อ.${amphure} จ.${province}`}</Text>
								</>
							),
						},
						{
							title: "เบอร์โทร",
							dataIndex: "tel",
							key: "tel",
							responsive: ["lg"],
							render: (_, { tel }) => {
								return (
									<>
										<Text>{tel}</Text>
									</>
								);
							},
						},
						{
							title: "อีเมล",
							dataIndex: "email",
							key: "email",
							responsive: ["lg"],
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

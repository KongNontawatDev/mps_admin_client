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
	Tooltip,
	Flex,
	Image,
	Form,
} from "antd";
import { useDebounce } from "use-debounce";
import {
	CheckCircleOutlined,
	ClearOutlined,
	FilterOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { SorterResult } from "antd/es/table/interface";

import useAuthStore from "../../store/authStore";
import useWithdrawStore from "../../store/withdrawStore";
import BreadcrumbLink from "../../components/shared/BreadcrumbLink";
import Inputtextfilter from "../../components/shared/InputTextfilter";
import { PaginationTable } from "../../components/shared/PaginationTable";
import DropdownFilter from "../../components/shared/DropdownFilter";
import { useLocation } from "react-router-dom";
import { ellipsis } from "../../utils/myFunction";
import { toDateTime } from "../../utils/dateFormat";
import type {
	Withdraw,
	WithdrawConditionSearch,
} from "../../services/types/WithdrawType";
import { useWithdrawImage, useWithdraws } from "./hooks/useWithdraw";
import BadgeWithdrawStatus from "../../components/shared/BadgeWithdrawStatus";
import { fallBackImage } from "../../utils/ImageUtils";
import WithdrawDetail from "./components/WithdrawDetail";
import { useOrgOptions } from "../org/hooks/useOrg";
import InputDate from "../../components/shared/InputDate";
import dayjs from "dayjs";

const { Title } = Typography;

type Props = {};
const pageTitle = "รายการขอเบิก-คืนวัสดุ";
const listItems = [{ title: pageTitle }];

export default function Withdraw({}: Props) {
	const [accessToken] = useAuthStore((state) => [state.accessToken]);
	const WithdrawStore = useWithdrawStore((state) => state);
	const location = useLocation();
	const {
		page,
		searchState,
		status,
		resetWithdrawFilter,
		setWithdrawFilter,
		textfilter,
		org_id,
		end_date,
		start_date,
	} = WithdrawStore;

	const [sortedInfo, setSortedInfo] = useState<SorterResult<Withdraw>>({});
	const [rowId, setRowId] = useState(0);
	const [openDrawer, setOpenDrawer] = useState(false);
	const [debounce] = useDebounce(textfilter, 700);
	const setCondition = () => {
		const condition: WithdrawConditionSearch = {
			sortorder: sortedInfo.order!,
			sortfield: sortedInfo.field?.toString()!,
			page: page,
			textfilter: textfilter,
			status: status.toString(),
			org_id: org_id.toString(),
			start_date: start_date,
			end_date: end_date,
		};
		return condition;
	};

	const initSort: SorterResult<Withdraw> = {
		field: "",
		order: "descend",
	};

	const requestCondition: WithdrawConditionSearch = setCondition();
	const { data, isLoading, setFilter } = useWithdraws(
		requestCondition,
		accessToken
	);
	const OrgOption = useOrgOptions(accessToken);
	useEffect(() => {
		onFilter();
	}, [
		debounce,
		page,
		sortedInfo.order,
		sortedInfo.field,
		status,
		org_id,
		start_date,
		end_date,
	]);

	useEffect(() => {
		if (location.state?.sidebar) {
			setSortedInfo(initSort);
			setWithdrawFilter({
				...WithdrawStore,
				page: 1,
			});
		}
	}, []);

	const onFilter = () => {
		setFilter(setCondition());
	};

	const onClearFilter = () => {
		resetWithdrawFilter();
	};

	const textfilterDebounced = (e: React.ChangeEvent<HTMLInputElement>) => {
		setWithdrawFilter({
			...WithdrawStore,
			textfilter: e.target.value,
			page: 1,
		});
	};

	const onChange: TableProps<Withdraw>["onChange"] = (
		{},
		{},
		sorter,
		extra
	) => {
		if (extra.action == "sort") {
			const sort = sorter as SorterResult<Withdraw>;
			if (sort.order == undefined) {
				setSortedInfo(initSort);
			} else {
				setSortedInfo(sort);
			}
			setWithdrawFilter({
				...WithdrawStore,
				page: 1,
			});
		}
	};

	const onChangePagination: PaginationProps["onChange"] = (page) => {
		setWithdrawFilter({
			...WithdrawStore,
			page: page,
		});
	};

	const onChangeStatusFilter = (value: string) => {
		if (value) {
			setWithdrawFilter({
				...WithdrawStore,
				status: Number(value),
				page: 1,
			});
		} else {
			setWithdrawFilter({
				...WithdrawStore,
				status: 0,
				page: 1,
			});
		}
	};

	const onChangeOrgFilter = (value: number) => {
		if (value) {
			setWithdrawFilter({
				...WithdrawStore,
				org_id: Number(value),
				page: 1,
			});
		} else {
			setWithdrawFilter({
				...WithdrawStore,
				org_id: 0,
				page: 1,
			});
		}
	};

	return (
		<>
			<WithdrawDetail
				rowId={rowId}
				onCancel={() => setOpenDrawer(false)}
				open={openDrawer}
			/>
			<Row align={"middle"} style={{ marginTop: "15px" }}>
				<Col sm={12}>
					<Title level={4} style={{ margin: "10px 0 5px" }}>
						<CheckCircleOutlined /> {pageTitle}
					</Title>
				</Col>
				<Col sm={12}>
					<BreadcrumbLink listItems={listItems} />
				</Col>
			</Row>
			<Card>
				<Row justify={"space-between"} gutter={[10, 10]}>
					<Col span={24} lg={22} md={{ order: 1, span: 22 }} order={2}>
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

							<Col span={24} md={8} lg={5}>
								{!searchState || (
									<DropdownFilter
										onChange={onChangeStatusFilter}
										options={[
											{ value: 0, label: "ทั้งหมด" },
											{ value: 1, label: "รายการขอเบิก" },
											{ value: 2, label: "รายการขอคืน" },
										]}
										value={status}
										placeholder="เลือกประเภทรายการ"
										name="dropdown-filter-status"
									/>
								)}
							</Col>
							<Col span={24} md={12} lg={5}>
								{!searchState || (<DropdownFilter
									onChange={onChangeOrgFilter}
									options={OrgOption.data}
									value={org_id}
									placeholder="เลือกหน่วยงาน/บริษัท"
									fieldLabel="name"
									fieldValue="id"
									name="dropdown-filter-org"
								/>)}
							</Col>
							<Col span={24} md={8}>
								{!searchState || (<Form layout="vertical">
									<Form.Item>
										<div
											style={{
												width: "100%",
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
												gap: 5,
											}}
										>
											<InputDate
												size="middle"
												placeholder={"วันเริ่มต้น"}
												value={start_date && dayjs(start_date)}
												onChange={(value: any) =>
													setWithdrawFilter({
														...WithdrawStore,
														start_date: value,
													})
												}
											/>
											<InputDate
												size="middle"
												placeholder={"วันสิ้นสุด"}
												value={end_date && dayjs(end_date)}
												onChange={(value: any) =>
													setWithdrawFilter({
														...WithdrawStore,
														end_date: value,
													})
												}
											/>
										</div>
									</Form.Item>
								</Form>)}
							</Col>
						</Row>
					</Col>
					<Col span={24} md={{ order: 2, span: 2 }} order={1}>
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
										setWithdrawFilter({
											...WithdrawStore,
											searchState: !searchState,
										})
									}
									icon={<FilterOutlined />}
								/>
							</Tooltip>
						</Flex>
					</Col>
				</Row>

				<Table
					columns={[
						{
							title: "รหัส",
							dataIndex: "id",
							align: "center",
							width: 70,
							sorter: true,
							sortOrder: sortedInfo.field === "id" ? sortedInfo.order : null,
							render: (_, { id }) => <>{ellipsis(id)}</>,
						},
						{
							key: "status",
							dataIndex: "status",
							width: 70,
							render: (_, { status }) => <>{BadgeWithdrawStatus(status)}</>,
						},
						{
							title: "รูปหลักฐาน",
							dataIndex: "image",
							width: 120,
							render: (_, { image }) => (
								<>
									<Image
										src={useWithdrawImage(image)}
										width={70}
										height={70}
										fallback={fallBackImage}
										style={{ objectFit: "cover" }}
									/>
								</>
							),
						},
						{
							title: "ชื่อ - สกุล",
							dataIndex: "first_name",
							sorter: true,
							sortOrder:
								sortedInfo.field === "first_name" ? sortedInfo.order : null,
							render: (_, { first_name, last_name }) => (
								<Highlighter
									searchWords={[textfilter]}
									textToHighlight={`${first_name} ${last_name}`}
								/>
							),
						},
						{
							title: "หน่วยงาน",
							dataIndex: "org_id",
							sorter: true,
							sortOrder:
								sortedInfo.field === "org_id" ? sortedInfo.order : null,
							render: (_, { org: { name } }) => (
								<Highlighter
									searchWords={[textfilter]}
									textToHighlight={`${name}`}
								/>
							),
						},
						{
							title: "จำนวน",
							dataIndex: "total_amount",
						},
						{
							title: "โครงการ",
							dataIndex: "worksite",
							render: (_, { worksite }) => (
								<Highlighter
									searchWords={[textfilter]}
									textToHighlight={`${worksite}`}
								/>
							),
						},
						{
							title: "ทำรายการเมื่อ",
							dataIndex: "withdraw_date",
							render: (_, { withdraw_date }) => (
								<>{toDateTime(withdraw_date)}</>
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
					onRow={(record) => {
						return {
							onClick: (e: any) => {
								if (e.target.className == "ant-image-mask-info") {
									return;
								} else {
									setRowId(record.id);
									setOpenDrawer(true);
								}
							},
						};
					}}
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

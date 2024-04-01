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
	Form,
	Input,
	Select,
	Alert,
} from "antd";
import { useDebounce } from "use-debounce";
import {
	BarChartOutlined,
	ClearOutlined,
	DeleteOutlined,
	DownloadOutlined,
	FileExcelOutlined,
	FilterOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { SorterResult } from "antd/es/table/interface";
import { useLocation } from "react-router-dom";

import {
	ConditionFilterType,
	useReportFile,
	useReportDelete,
	useReportSave,
	useReports,
} from "./hooks";
import useAuthStore from "../../store/authStore";
import useReportStore from "../../store/reportStore";
import BreadcrumbLink from "../../components/shared/BreadcrumbLink";
import InputTextFilter from "../../components/shared/InputTextfilter";
import { PaginationTable } from "../../components/shared/PaginationTable";
import PopconfirmDelete from "../../components/shared/PopconfirmDelete";
import { ReportBodyRespone } from "./types";
import InputDate from "../../components/shared/InputDate";
import dayjs from "dayjs";
import { DownloadWindow, ellipsis } from "../../utils/myFunction";
import { toDate } from "../../utils/dateFormat";
const { Title, Text } = Typography;

type Props = {};
const pageTitle = "สรุปรายงาน";
const listItems = [{ title: pageTitle }];

function getCurrentMonthInThai(): string {
	const currentMonthIndex = dayjs().month();
	const thaiMonths = [
		"มกราคม",
		"กุมภาพันธ์",
		"มีนาคม",
		"เมษายน",
		"พฤษภาคม",
		"มิถุนายน",
		"กรกฎาคม",
		"สิงหาคม",
		"กันยายน",
		"ตุลาคม",
		"พฤศจิกายน",
		"ธันวาคม",
	];

	return thaiMonths[currentMonthIndex];
}

export default function Report({}: Props) {
	const [accessToken] = useAuthStore((state) => [state.accessToken]);
	const location = useLocation();
	const [errorMsg, setErrorMsg] = useState({ status: false, message: "" });
	const [loadingSave, setLoadingSave] = useState(false);
	const [fileDownload, setFileDownload] = useState("");
	const [form] = Form.useForm<{
		title: string;
		month: string;
		year: number;
		start_date: string;
		end_date: string;
	}>();
	const userSave = useReportSave(accessToken);
	const ReportStore = useReportStore((state) => state);
	const {
		page,
		searchState,
		resetReportFilter,
		setReportFilter,
		textfilter,
	} = ReportStore;

	const [sortedInfo, setSortedInfo] = useState<SorterResult<ReportBodyRespone>>(
		{}
	);

	const [debounce] = useDebounce(textfilter, 700);
	const setCondition = () => {
		const condition: ConditionFilterType = {
			sortorder: sortedInfo.order!,
			sortfield: sortedInfo.field?.toString()!,
			page: page,
			textfilter: textfilter,
		};
		return condition;
	};

	const initSort: SorterResult<ReportBodyRespone> = {
		field: "",
		order: "descend",
	};

	const requestCondition: ConditionFilterType = setCondition();
	const { data, isLoading, setFilter } = useReports(
		requestCondition,
		accessToken
	);
	const ReportDelete = useReportDelete(accessToken);

	useEffect(() => {
		onFilter();
	}, [debounce, page, sortedInfo.order, sortedInfo.field]);

	useEffect(() => {
		if (location.state?.sidebar) {
			setSortedInfo(initSort);
			setReportFilter({
				...ReportStore,
				page: 1,
			});
		}
	}, []);

	const onFilter = () => {
		setFilter(setCondition());
	};

	const onClearFilter = () => {
		resetReportFilter();
	};

	const textfilterDebounced = (e: React.ChangeEvent<HTMLInputElement>) => {
		setReportFilter({
			...ReportStore,
			textfilter: e.target.value,
			page: 1,
		});
	};

	const onChange: TableProps<ReportBodyRespone>["onChange"] = (
		{},
		{},
		sorter,
		extra
	) => {
		if (extra.action == "sort") {
			const sort = sorter as SorterResult<ReportBodyRespone>;
			if (sort.order == undefined) {
				setSortedInfo(initSort);
			} else {
				setSortedInfo(sort);
			}
			setReportFilter({
				...ReportStore,
				page: 1,
			});
		}
	};

	const handleDelete = async (id: number) => {
		await ReportDelete.mutateAsync(id).then(() => {
			notification.open({
				message: "ลบข้อมูลสำเร็จ",
				type: "success",
			});
		});
	};

	const onChangePagination: PaginationProps["onChange"] = (page) => {
		setReportFilter({
			...ReportStore,
			page: page,
		});
	};

	// บันทึกลงฐานข้อมูล
	const onSubmit = async (data: any) => {
		try {
			setLoadingSave(true);
			const res = await userSave.mutateAsync(data);

			if (res.message == "name_duplicate") {
				setErrorMsg({
					status: true,
					message: `ชื่อไฟล์นี้มีอยู่ในระบบแล้ว กรุณาเปลี่ยนชื่อไฟล์ใหม่`,
				});
				setLoadingSave(false);
				// navigate('/report')
			} else {
				dowloadFile(useReportFile(res.message));
				notification.open({
					message: "บันทึกข้อมูลสำเร็จ",
					type: "success",
				});
				onReset();
				setErrorMsg({ status: false, message: "" });
				setLoadingSave(false);
			}
		} catch (error) {
			setErrorMsg({ status: true, message: "มีบางอย่างผิดพลาด" });
			setLoadingSave(false);
		}
	};

	// ล้างฟอร์มทั้งหมด
	const onReset = () => {
		form.resetFields();
	};

	const dowloadFile = (value: string) => {
		setFileDownload("");
		if (fileDownload == "") {
			setFileDownload(value);
		}
	};

	return (
		<>
			<DownloadWindow fileUrl={fileDownload} />
			<Row align={"middle"} style={{ marginTop: "15px" }}>
				<Col sm={12}>
					<Title level={4} style={{ margin: "10px 0 5px" }}>
						<BarChartOutlined /> {pageTitle}
					</Title>
				</Col>
				<Col sm={12}>
					<BreadcrumbLink listItems={listItems} />
				</Col>
			</Row>
			<Card loading={loadingSave}>
				{errorMsg.status && (
					<Alert
						message={
							<Text style={{ color: "black", fontSize: "1.2rem" }}>
								บันทึกไม่สำเร็จ!!
							</Text>
						}
						description={
							<Text style={{ color: "black" }}>{errorMsg.message}</Text>
						}
						type="error"
						closable
						showIcon
						onClose={() => setErrorMsg({ status: false, message: "" })}
						style={{ marginBottom: "10px" }}
					/>
				)}
				<Form
					form={form}
					name="report_form"
					initialValues={{
						title: `รายงานประจำเดือน${getCurrentMonthInThai()}${Number(
							dayjs().year() + 543
						)}`,
						year: Number(dayjs().year() + 543),
						month: getCurrentMonthInThai(),
						start_date: dayjs().subtract(30, "day"),
						end_date: dayjs(),
					}}
					onFinish={onSubmit}
					layout="vertical"
					style={{ marginTop: "20px" }}
				>
					<Row align={"middle"} gutter={15}>
						{/* ชื่อไฟล์ */}
						<Col span={24} md={12}>
							<Form.Item
								name="title"
								label="ชื่อไฟล์"
								rules={[
									{ required: true, message: "กรุณากรอกข้อมูล" },
									{ max: 255, message: "ห้ามกรอกข้อมูลเกิน 255 ตัวอักษร" },
								]}
							>
								<Input
									size="large"
									placeholder="กรุณากรอกชื่อไฟล์"
									allowClear
								/>
							</Form.Item>
						</Col>
						{/* รายงานประจำเดือน */}
						<Col span={24} md={6}>
							<Form.Item
								name="month"
								label="รายงานประจำเดือน"
								rules={[{ required: true, message: "กรุณากรอกข้อมูล" }]}
							>
								<Select
									placeholder="เลือกเดือน"
									options={[
										{ value: "มกราคม", label: "มกราคม" },
										{ value: "กุมภาพันธ์", label: "กุมภาพันธ์" },
										{ value: "มีนาคม", label: "มีนาคม" },
										{ value: "เมษายน", label: "เมษายน" },
										{ value: "พฤษภาคม", label: "พฤษภาคม" },
										{ value: "มิถุนายน", label: "มิถุนายน" },
										{ value: "กรกฎาคม", label: "กรกฎาคม" },
										{ value: "สิงหาคม", label: "สิงหาคม" },
										{ value: "กันยายน", label: "กันยายน" },
										{ value: "ตุลาคม", label: "ตุลาคม" },
										{ value: "พฤศจิกายน", label: "พฤศจิกายน" },
										{ value: "ธันวาคม", label: "ธันวาคม" },
									]}
									size="large"
								/>
							</Form.Item>
						</Col>
						{/* รายงานประจำปี */}
						<Col span={24} md={6}>
							<Form.Item
								name="year"
								label="ปี"
								rules={[{ required: true, message: "กรุณากรอกข้อมูล" }]}
							>
								<Select
									placeholder="เลือกปี"
									options={[
										{ value: 2560, label: "2560" },
										{ value: 2561, label: "2561" },
										{ value: 2562, label: "2562" },
										{ value: 2563, label: "2563" },
										{ value: 2564, label: "2564" },
										{ value: 2565, label: "2565" },
										{ value: 2566, label: "2566" },
										{ value: 2567, label: "2567" },
										{ value: 2568, label: "2568" },
										{ value: 2569, label: "2569" },
										{ value: 2570, label: "2570" },
										{ value: 2570, label: "2571" },
										{ value: 2570, label: "2572" },
										{ value: 2570, label: "2573" },
									]}
									size="large"
								/>
							</Form.Item>
						</Col>

						<Col span={24} md={6}>
							<Form.Item
								name="start_date"
								label="ข้อมูลตั้งแต่วันที่"
								rules={[{ required: true, message: "กรุณากรอกข้อมูล" }]}
							>
								<InputDate placeholder={"วันเริ่มต้น"} />
							</Form.Item>
						</Col>
						<Col span={24} md={6}>
							<Form.Item
								name="end_date"
								label="จนถึง"
								rules={[{ required: true, message: "กรุณากรอกข้อมูล" }]}
							>
								<InputDate placeholder={"วันสิ้นสุด"} />
							</Form.Item>
						</Col>
					</Row>

					<div style={{ display: "flex", justifyContent: "space-between" }}>
						<Space>
							<Button onClick={onReset} icon={<ClearOutlined />} type="text">
								ล้างข้อมูล
							</Button>
						</Space>
						<Space>
							<Button
								htmlType="submit"
								type="primary"
								icon={<FileExcelOutlined />}
								size="large"
							>
								ออกรายงาน Excel
							</Button>
						</Space>
					</div>
				</Form>
			</Card>

			<Title level={4} style={{ margin: "30px 0 5px" }}>
				<BarChartOutlined /> รายงานย้อนหลัง
			</Title>

			<Card
				style={{ marginTop: "15px" }}
				title={
					<Row align={"middle"}>
						<Col order={2} sm={{ order: 1, span: 12 }}>
							<Space>
								<Button
									type="text"
									onClick={onClearFilter}
									icon={<ClearOutlined />}
									size="small"
								>
									ล้างการค้นหา
								</Button>
								<Button
									type={searchState ? "text" : "default"}
									onClick={() =>
										setReportFilter({
											...ReportStore,
											searchState: !searchState,
										})
									}
									icon={<FilterOutlined />}
									size="small"
								>
									{searchState ? "ปิดตัวกรอง" : "เปิดตัวกรอง"}
								</Button>
							</Space>
						</Col>
						<Col
							order={1}
							sm={{ order: 2, span: 12 }}
							style={{ textAlign: "right" }}
						>
							<Space></Space>
						</Col>
					</Row>
				}
			>
				{!searchState || (
					<Row gutter={[15, 15]}>
						<Col span={24}>
							<InputTextFilter
								label="คำค้นหา"
								placeholder="ค้นหา ชื่อไฟล์รายงาน"
								value={textfilter}
								onSearch={onFilter}
								onChange={textfilterDebounced}
								onPressEnter={onFilter}
							/>
						</Col>
					</Row>
				)}

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
							title: "ชื่อไฟล์",
							dataIndex: "name",
							sorter: true,
							sortOrder: sortedInfo.field === "name" ? sortedInfo.order : null,
							render: (_, { name }) => (
								<Tooltip title="คลิก 2 ครั้ง เพื่อดาวน์โหลดไฟล์">
									<Text
										className="not-select"
										onClick={() => {
											dowloadFile(useReportFile(name));
										}}
										style={{ cursor: "pointer" }}
									>
										<Highlighter
											searchWords={[textfilter]}
											textToHighlight={name}
										/>
									</Text>
								</Tooltip>
							),
						},
						{
							title: "ข้อมูลของวันที่",
							dataIndex: "start_date",
							sorter: true,
							sortOrder:
								sortedInfo.field === "start_date" ? sortedInfo.order : null,
							render: (_, { start_date, end_date }) => (
								<>
									{toDate(start_date)} - {toDate(end_date)}
								</>
							),
						},
						{
							title: "ประจำเดือน",
							dataIndex: "month",
							sorter: true,
							sortOrder: sortedInfo.field === "month" ? sortedInfo.order : null,
							render: (_, { month }) => <>{month}</>,
						},
						{
							title: "ปี",
							dataIndex: "year",
							sorter: true,
							sortOrder: sortedInfo.field === "year" ? sortedInfo.order : null,
							render: (_, { year }) => <>{year}</>,
						},
						{
							title: "",
							key: "action",
							align: "right",
							width: 90,
							render: (_, { id, name }) => (
								<Space>
									<Tooltip title="คลิก 2 ครั้ง เพื่อดาวน์โหลดไฟล์" placement="bottom">
										<Button
											onClick={() => {
												dowloadFile(useReportFile(name));
											}}
											icon={<DownloadOutlined />}
											type="text"
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
					dataSource={data.results}
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
					total={data.totalItem}
					totalItem={data.totalItem}
					totalRecord={data.totalRecord}
				/>
			</Card>
		</>
	);
}

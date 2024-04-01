import {
	Alert,
	Button,
	Col,
	Form,
	Input,
	Modal,
	Row,
	Space,
	Spin,
	notification,
	Typography,
} from "antd";
import { useEffect, useState } from "react";
import {  BankOutlined, ClearOutlined, SaveOutlined } from "@ant-design/icons";
import useAuthStore from "../../../store/authStore";
import { useOrg } from "../hooks/useOrg";
import { useOrgSave } from "../hooks/useOrgMutate";
import { formOrgInitial } from "../../../services/types/OrgType";
import DropdownForm from "../../../components/shared/DropdownForm";
import { useAmphureOptions, useDistrictOptions, useProvinceOptions } from "../../location/hooks";
import { PatternFormat } from "react-number-format";
import { axiosInstance } from "../../../services/http";

type Props = {
	open: boolean;
	onCancel: () => void;
	rowId: number;
};

const { Text } = Typography;

export default function OrgForm({ open, onCancel, rowId }: Props) {
	const [accessToken] = useAuthStore((state) => [state.accessToken]);

	const [errorMsg, setErrorMsg] = useState({ status: false, message: "" });
	const [loadingSave, setLoadingSave] = useState(false);

	const [form] = Form.useForm();
	const userSave = useOrgSave(accessToken);
	const { data, isLoading, refetch,isFetching } = useOrg(rowId, accessToken);
		const ProvinceOptions = useProvinceOptions(accessToken);
	const AmphureOptions = useAmphureOptions(0,accessToken);
	const DistrictOptions = useDistrictOptions(0,accessToken);

	useEffect(() => {
		if (!isLoading && !isFetching ) {
			if (rowId === 0) {
				form.resetFields();
			} else {
				form.setFieldsValue(data);
				AmphureOptions.setFilter(data.province_id);
				DistrictOptions.setFilter(data.amphure_id);
			}
		}
		setErrorMsg({ status: false, message: "" });
	}, [rowId, onCancel,isFetching,isLoading]);

	// บันทึกลงฐานข้อมูล
	const onSubmit = async (data: any) => {
		try {
			setLoadingSave(true);
			rowId !== 0 ? (data.id = rowId) : null;

			const res = await userSave.mutateAsync(data);

			if (res.message == "name_duplicate") {
				setErrorMsg({ status: true, message: `ชื่อนี้มีอยู่ในระบบแล้ว` });
				setLoadingSave(false);
			} else {
				notification.open({
					message: "บันทึกข้อมูลสำเร็จ",
					type: "success",
				});
				refetch();
				setLoadingSave(false);
				onCancel();
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

		const handleProvinceChange = (value: string) => {
		if (value) {
			AmphureOptions.setFilter(Number(value));
			form.setFieldValue("amphure_id", undefined);
			form.setFieldValue("district_id", undefined);
		} else {
			AmphureOptions.setFilter(0);
			DistrictOptions.setFilter(0);
			form.setFieldValue("amphure_id", undefined);
			form.setFieldValue("district_id", undefined);
		}
	};

	const handleAmphureChange = (value: string) => {
		if (value) {
			DistrictOptions.setFilter(Number(value));
			form.setFieldValue("district_id", undefined);
			form.setFieldValue("zip_code", "");
		} else {
			DistrictOptions.setFilter(0);
			form.setFieldValue("district_id", undefined);
			form.setFieldValue("zip_code", "");
		}
	};

	const handleDistrict = async (value: string) => {
		if (value) {
			const { data } = await axiosInstance.get(`district/zip_code/${value}`, {
				params: { id: value },
			});
			form.setFieldValue("zip_code", data.results);
		}
	};

	return (
		<Modal
			open={open}
			title={
				<Space>
					<BankOutlined />
					{rowId == 0 ? "เพิ่มหน่วยงาน" : "แก้ไขหน่วยงาน"}
				</Space>
			}
			onCancel={onCancel}
			width={"50rem"}
			footer={false}
			centered
		>
			<Spin tip="กำลังโหลด" size="large" spinning={isLoading || loadingSave}>
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
					name="org_form"
					initialValues={formOrgInitial}
					onFinish={onSubmit}
					layout="vertical"
					style={{ marginTop: "20px" }}
				>
						<Row align={"middle"} gutter={15}>
						{/* ชื่อหน่วยงาน/บริษัท */}
						<Col span={24}>
							<Form.Item
								name="name"
								label="ชื่อหน่วยงาน/บริษัท"
								rules={[
									{ required: true, message: "กรุณากรอกข้อมูล" },
									{ max: 255, message: "ห้ามกรอกข้อมูลเกิน 255 ตัวอักษร" },
								]}
							>
								<Input
									size="large"
									placeholder="กรุณากรอกชื่อหน่วยงาน/บริษัท"
									allowClear
								/>
							</Form.Item>
						</Col>

						{/* ที่อยู่ */}
						<Col span={24}>
							<Form.Item
								name="address"
								label="ที่อยู่"
							>
								<Input.TextArea
									rows={2}
									size="large"
									placeholder="กรุณากรอกที่อยู่"
									allowClear
								/>
							</Form.Item>
						</Col>

						{/* จังหวัด */}
						<Col span={24} md={8}>
							<Form.Item
								name="province_id"
								label="จังหวัด"
							>
								<DropdownForm
									onChange={handleProvinceChange}
									options={ProvinceOptions?.data}
									loading={ProvinceOptions.isLoading}
									fieldLabel="name"
									fieldValue="id"
								/>
							</Form.Item>
						</Col>

						{/* อำเภอ */}
						<Col span={24} md={8}>
							<Form.Item
								name="amphure_id"
								label="อำเภอ"
							>
								<DropdownForm
									onChange={handleAmphureChange}
									options={AmphureOptions?.data}
									loading={AmphureOptions.isLoading}
									fieldLabel="name"
									fieldValue="id"
								/>
							</Form.Item>
						</Col>

						{/* ตำบล */}
						<Col span={24} md={8}>
							<Form.Item
								name="district_id"
								label="ตำบล"
							>
								<DropdownForm
									onChange={handleDistrict}
									options={DistrictOptions?.data}
									loading={DistrictOptions.isLoading}
									fieldLabel="name"
									fieldValue="id"
								/>
							</Form.Item>
						</Col>

						<Col span={24} md={8}>
							<Form.Item
								name="zip_code"
								label="รหัสไปรษณีย์"
							>
								<Input
									size="large"
									placeholder="กรอกรหัสไปรษณีย์"
									allowClear
								/>
							</Form.Item>
						</Col>

						{/* เบอร์โทร */}
						<Col span={24} md={8}>
							<Form.Item
								name="tel"
								label="เบอร์โทร"
								rules={[{ max: 13, message: "ห้ามกรอกข้อมูลเกิน 13 ตัวอักษร" }]}
							>
								<PatternFormat
									format="###-###-####"
									customInput={Input}
									size="large"
								/>
							</Form.Item>
						</Col>


						{/* อีเมล */}
						<Col span={24} md={8}>
							<Form.Item
								name="email"
								label="อีเมล"
								rules={[
									{ max: 150, message: "ห้ามกรอกข้อมูลเกิน 150 ตัวอักษร" },
									{ type: "email" },
								]}
							>
								<Input size="large" placeholder="กรุณากรอกอีเมล" allowClear />
							</Form.Item>
						</Col>

					</Row>

					<div style={{ display: "flex", justifyContent: "space-between" }}>
						<Space>
							{rowId == 0 && (
								<Button onClick={onReset} icon={<ClearOutlined />} type="text">
									ล้างข้อมูล
								</Button>
							)}
						</Space>
						<Space>
							<Button onClick={onCancel}>ยกเลิก</Button>
							<Button
								htmlType="submit"
								type="primary"
								icon={<SaveOutlined />}
								size="large"
							>
								บันทึกข้อมูล
							</Button>
						</Space>
					</div>
				</Form>
			</Spin>
		</Modal>
	);
}

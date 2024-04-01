import {
	Alert,
	Button,
	Col,
	Form,
	Input,
	Modal,
	Row,
	Select,
	Space,
	Spin,
	notification,
	Typography,
	Radio,
} from "antd";
import { useEffect, useState } from "react";
import {
	ClearOutlined,
	PlusOutlined,
	SaveOutlined,
	UsergroupAddOutlined,
} from "@ant-design/icons";
import Upload from "antd/es/upload";
import useAuthStore from "../../../store/authStore";
import { getBase64 } from "../../../utils/ImageUtils";
import { RcFile } from "antd/lib/upload";
import { useEmployeeSave } from "../hooks/useEmployeeMutate";
import { useEmployee, useEmployeeImage } from "../hooks/useEmployee";
import { formEmployeeInitial } from "../../../services/types/EmployeeType";
import {
	useAmphureOptions,
	useDistrictOptions,
	useProvinceOptions,
} from "../../location/hooks";
import DropdownForm from "../../../components/shared/DropdownForm";
import { axiosInstance } from "../../../services/http";
import { PatternFormat } from "react-number-format";
import { useOrgOptions } from "../../org/hooks/useOrg";
import InputDate from "../../../components/shared/InputDate";
import dayjs from "dayjs";
type Props = {
	open: boolean;
	onCancel: () => void;
	rowId: number;
};
const { Text } = Typography;

export default function EmployeeForm({ open, onCancel, rowId }: Props) {
	const [accessToken] = useAuthStore((state) => [state.accessToken]);

	const [errorMsg, setErrorMsg] = useState({ status: false, message: "" });
	const [loadingSave, setLoadingSave] = useState(false);
	const [image, setImage] = useState(null);
	const [imageUrl, setImageUrl] = useState<string>();

	const [form] = Form.useForm();
	const employeeSave = useEmployeeSave(accessToken);
	const { data, isLoading, refetch, isFetching } = useEmployee(
		rowId,
		accessToken
	);
	const ProvinceOptions = useProvinceOptions(accessToken);
	const AmphureOptions = useAmphureOptions(0, accessToken);
	const DistrictOptions = useDistrictOptions(0, accessToken);
	const OrgOption = useOrgOptions(accessToken);
	useEffect(() => {
		if (!isLoading && !isFetching) {
			if (rowId === 0) {
				form.resetFields();
				setImageUrl("");
			} else {
				form.setFieldsValue(data);
				form.setFieldValue("birthday", dayjs(data.birthday));
				AmphureOptions.setFilter(data?.province_id);
				DistrictOptions.setFilter(data?.amphure_id);
				setImageUrl(data?.image ? useEmployeeImage(data?.image) : "");
			}
		}
		setImage(null);
		setErrorMsg({ status: false, message: "" });
	}, [rowId, onCancel, isLoading, isFetching]);

	useEffect(() => {
		setImage(image);
	}, [image]);

	// บันทึกลงฐานข้อมูล
	const onSubmit = async (formData: any) => {
		try {
			setLoadingSave(true);

			rowId !== 0 ? (formData.id = rowId) : null;
			image ? (formData.image = image) : null;
			formData.status = data.status

			const res = await employeeSave.mutateAsync(formData);

			if (res.message == "email_duplicate") {
				setErrorMsg({ status: true, message: `อีเมลนี้มีอยู่ในระบบแล้ว` });
				setLoadingSave(false);
			} else if (res.message == "employee_name_duplicate") {
				setErrorMsg({ status: true, message: `ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว` });
				setLoadingSave(false);
			} else {
				notification.open({
					message: "บันทึกข้อมูลสำเร็จ",
					type: "success",
				});
				setLoadingSave(false);
				refetch();
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
		setImageUrl("");
		setImage(null);
	};

	// แสดงผลรูปภาพ
	const customRequest = async ({ file }: any) => {
		setImage(file);
		getBase64(file as RcFile, (url) => {
			setImageUrl(url);
		});
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
					<UsergroupAddOutlined />
					{rowId == 0 ? "เพิ่มพนักงาน" : "แก้ไขพนักงาน"}
				</Space>
			}
			onCancel={onCancel}
			width={"60rem"}
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
					name="employee_form"
					initialValues={formEmployeeInitial}
					onFinish={onSubmit}
					layout="vertical"
					style={{ marginTop: "20px" }}
				>
					<Row align={"middle"} gutter={15}>
						{/* //อัพโหลดรูปโปรไฟล์ */}
						<Col span={24}>
							<Form.Item
								valuePropName="image"
								tooltip="ต้องเป็นไฟล์รูปภาพเท่านั้น และขนาดต้องไม่เกิน 4 MB"
								label="อัพโหลดรูปโปรไฟล์"
								style={{ display: "flex", justifyContent: "center" }}
							>
								<Upload
									name="image"
									listType="picture-card"
									className="avatar-uploader"
									showUploadList={false}
									customRequest={customRequest}
									accept="image/png, image/jpeg"
								>
									{imageUrl ? (
										<img
											src={imageUrl}
											alt="avatar"
											style={{
												width: "150px",
												height: "150px",
												objectFit: "cover",
											}}
										/>
									) : (
										<div>
											<PlusOutlined />
											<div style={{ marginTop: 8 }}>อัพโหลดรูป</div>
										</div>
									)}
								</Upload>
							</Form.Item>
						</Col>

						{/* คำนำหน้า */}
						<Col span={24} md={4}>
							<Form.Item
								name="title_name"
								label="คำนำหน้า"
								rules={[{ required: true, message: "กรุณาเลือกข้อมูล" }]}
							>
								<Select
									options={[
										{ value: "นางสาว", label: "นางสาว" },
										{ value: "นาง", label: "นาง" },
										{ value: "นาย", label: "นาย" },
									]}
									size="large"
								/>
							</Form.Item>
						</Col>

						{/* ชื่อ */}
						<Col span={24} md={10}>
							<Form.Item
								name="first_name"
								label="ชื่อ"
								rules={[
									{ required: true, message: "กรุณากรอกข้อมูล" },
									{ max: 150, message: "ห้ามกรอกข้อมูลเกิน 150 ตัวอักษร" },
								]}
							>
								<Input size="large" placeholder="กรุณากรอกชื่อ" allowClear />
							</Form.Item>
						</Col>

						{/* นามสกุล */}
						<Col span={24} md={10}>
							<Form.Item
								name="last_name"
								label="นามสกุล"
								rules={[
									{ required: true, message: "กรุณากรอกข้อมูล" },
									{ max: 150, message: "ห้ามกรอกข้อมูลเกิน 150 ตัวอักษร" },
								]}
							>
								<Input size="large" placeholder="กรุณากรอกนามสกุล" allowClear />
							</Form.Item>
						</Col>

						{/* เพศ */}
						<Col span={24} md={8}>
							<Form.Item
								name="gender"
								label="เพศ"
								rules={[{ required: true, message: "กรุณากรอกข้อมูล" }]}
							>
								<Radio.Group size="large">
									<Radio value={"ชาย"}>ชาย</Radio>
									<Radio value={"หญิง"}>หญิง</Radio>
									<Radio value={"ไม่ระบุ"}>ไม่ระบุ</Radio>
								</Radio.Group>
							</Form.Item>
						</Col>

						{/* เลขบัตรประชาชน */}
						<Col span={24} md={8}>
							<Form.Item
								name="id_card"
								label="เลขบัตรประชาชน"
								rules={[{ required: true, message: "กรุณากรอกข้อมูล" }]}
							>
								<PatternFormat
									format="# #### ##### ## #"
									customInput={Input}
									size="large"
									placeholder="เลขบัตรประชาชน 13 หลัก"
								/>
							</Form.Item>
						</Col>

						{/* วันเกิด */}
						<Col span={24} md={8}>
							<Form.Item
								name="birthday"
								label="วันเกิด"
								rules={[{ required: true, message: "กรุณากรอกข้อมูล" }]}
							>
								<InputDate
									onChange={(value: any) => {
										form.setFieldValue("birthday", value);
									}}
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
									options={ProvinceOptions.data}
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
									options={AmphureOptions.data}
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
									options={DistrictOptions.data}
									loading={DistrictOptions.isLoading}
									fieldLabel="name"
									fieldValue="id"
									onChange={handleDistrict}
								/>
							</Form.Item>
						</Col>

						{/* รหัสไปรษณีย์ */}
						<Col span={24} md={8}>
							<Form.Item
								name="zip_code"
								label="รหัสไปรษณีย์"
								tooltip="ระบบจะกรอกข้อมูลให้อัตโนมัติ"
							>
								<Input size="large" placeholder="กรุณากรอกรหัสไปรษณีย์" />
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

						<Col md={8}></Col>

						{/* หน่วยงาน/บริษัท */}
						<Col span={24} md={8}>
							<Form.Item
								name="org_id"
								label="ประจำอยู่หน่วยงาน/บริษัท"
								rules={[{ required: true, message: "กรุณาเลือกข้อมูล" }]}
							>
								<DropdownForm
									options={OrgOption.data}
									loading={OrgOption.isLoading}
									fieldLabel="name"
									fieldValue="id"
								/>
							</Form.Item>
						</Col>

						{/* ตำแหน่งงาน */}
						<Col span={24} md={8}>
							<Form.Item
								name="position"
								label="ตำแหน่งงาน"
							>
								<Input size="large" placeholder="กรุณาตำแหน่งงาน" />
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

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
	Switch,
	InputNumber,
} from "antd";
import { useEffect, useState } from "react";
import {
	ClearOutlined,
	CodeSandboxOutlined,
	PlusOutlined,
	SaveOutlined,
} from "@ant-design/icons";
import Upload from "antd/es/upload";
import useAuthStore from "../../../store/authStore";
import { getBase64 } from "../../../utils/ImageUtils";
import { RcFile } from "antd/lib/upload";
import { useMaterialSave } from "../hooks/useMaterialMutate";
import { useMaterial, useMaterialImage } from "../hooks/useMaterial";
import { formMaterialInitial } from "../../../services/types/MaterialType";
import DropdownForm from "../../../components/shared/DropdownForm";
import { useUnitOptions } from "../../unit/hooks/useUnit";
import { useCategoryOptions } from "../../category/hooks/useCategory";
type Props = {
	open: boolean;
	onCancel: () => void;
	rowId: number;
};
const { Text } = Typography;

export default function MaterialForm({ open, onCancel, rowId }: Props) {
	const [accessToken] = useAuthStore((state) => [state.accessToken]);
	const [errorMsg, setErrorMsg] = useState({ status: false, message: "" });
	const [loadingSave, setLoadingSave] = useState(false);
	const [image, setImage] = useState(null);
	const [imageUrl, setImageUrl] = useState<string>();

	const [form] = Form.useForm();
	const publishCheck = Form.useWatch("publish", form);
	const materialSave = useMaterialSave(accessToken);
	const { data, isLoading, refetch, isFetching } = useMaterial(
		rowId,
		accessToken
	);
	const UnitOption = useUnitOptions(accessToken);
	const CategoryOption = useCategoryOptions(accessToken);
	useEffect(() => {
		if (!isLoading && !isFetching) {
			if (rowId === 0) {
				form.resetFields();
				setImageUrl("");
			} else {
				form.setFieldsValue(data);
				form.setFieldValue("password", "");
				setImageUrl(data?.image ? useMaterialImage(data?.image) : "");
			}
		}
		setImage(null);
		setErrorMsg({ status: false, message: "" });
	}, [rowId, onCancel, isLoading, isFetching]);

	useEffect(() => {
		setImage(image);
	}, [image]);

	// บันทึกลงฐานข้อมูล
	const onSubmit = async (data: any) => {
		try {
			setLoadingSave(true);

			rowId !== 0 ? (data.id = rowId) : null;
			image ? (data.image = image) : null;

			const res = await materialSave.mutateAsync(data);

			if (res.message == "email_duplicate") {
				setErrorMsg({ status: true, message: `อีเมลนี้มีอยู่ในระบบแล้ว` });
				setLoadingSave(false);
			} else if (res.message == "material_name_duplicate") {
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

	return (
		<Modal
			open={open}
			title={
				<Space>
					<CodeSandboxOutlined />
					{rowId == 0 ? "เพิ่มวัสดุ/อุปกรณ์" : "แก้ไขวัสดุ/อุปกรณ์"}
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
					name="material_form"
					initialValues={formMaterialInitial}
					onFinish={onSubmit}
					layout="vertical"
					style={{ marginTop: "20px" }}
				>
					<Row align={"middle"} gutter={15}>
						{/* อัพโหลดรูปโปรไฟล์ */}
						<Col span={24}>
							<Form.Item
								valuePropName="image"
								tooltip="ต้องเป็นไฟล์รูปภาพเท่านั้น และขนาดต้องไม่เกิน 4 MB"
								label="อัพโหลดรูปวัสดุ/อุปกรณ์"
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
											alt="image"
											style={{
												width: "150px",
												height: "150px",
												objectFit: "cover",
											}}
										/>
									) : (
										<div>
											<PlusOutlined />
											<div style={{ marginTop: 8 }}>
												อัพโหลดรูปวัสดุ/อุปกรณ์
											</div>
										</div>
									)}
								</Upload>
							</Form.Item>
						</Col>
						{/* sku */}
						<Col span={24} md={6}>
							<Form.Item
								name="sku"
								label="SKU"
								rules={[
									{ required: true, message: "กรุณากรอกข้อมูล" },
									{ max: 10, message: "ห้ามกรอกข้อมูลเกิน 10 ตัวอักษร" },
								]}
							>
								<Input size="large" placeholder="กรุณากรอก SKU" allowClear />
							</Form.Item>
						</Col>
						{/* ชื่อผู้ใช้ */}
						<Col span={24} md={12}>
							<Form.Item
								name="name"
								label="ชื่อวัสดุ/อุปกรณ์"
								rules={[
									{ required: true, message: "กรุณากรอกข้อมูล" },
									{ max: 255, message: "ห้ามกรอกข้อมูลเกิน 255 ตัวอักษร" },
								]}
							>
								<Input
									size="large"
									placeholder="กรุณากรอกวัสดุ/อุปกรณ์"
									allowClear
								/>
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item
								name="cat_id"
								label="ประเภท"
								rules={[{ required: true, message: "กรุณาเลือกข้อมูล" }]}
							>
								<DropdownForm
									options={CategoryOption.data}
									loading={CategoryOption.isLoading}
									fieldLabel="name"
									fieldValue="id"
								/>
							</Form.Item>
						</Col>

						<Col span={24} md={6}>
							<Form.Item name="stock" label="สต๊อก" rules={[]}>
								<InputNumber min={0} size="large" style={{ width: "100%" }} />
							</Form.Item>
						</Col>

						<Col span={24} md={6}>
							<Form.Item name="weight" label="น้ำหนัก" rules={[]}>
								<InputNumber addonAfter={"กก."} min={0} size="large" />
							</Form.Item>
						</Col>

						<Col span={24} md={6}>
							<Form.Item name="height" label="สูง" rules={[]}>
								<InputNumber addonAfter={"ซม."} min={0} size="large" />
							</Form.Item>
						</Col>

						<Col span={24} md={6}>
							<Form.Item name="width" label="กว้าง" rules={[]}>
								<InputNumber addonAfter={"ซม."} min={0} size="large" />
							</Form.Item>
						</Col>

						{/* หน่วยงาน/บริษัท */}
						<Col span={6}>
							<Form.Item
								name="unit"
								label="หน่วยนับ"
								rules={[{ required: true, message: "กรุณาเลือกข้อมูล" }]}
							>
								<DropdownForm
									options={UnitOption.data}
									loading={UnitOption.isLoading}
									fieldLabel="name"
									fieldValue="name"
								/>
							</Form.Item>
						</Col>

						{/* ระดับผู้ใช้ */}
						<Col span={24} md={6}>
							<Form.Item
								name="status"
								label="สถานะ"
								rules={[{ required: true, message: "กรุณาเลือกข้อมูล" }]}
							>
								<Select
									options={[
										{ value: 1, label: "พร้อมเบิก" },
										{ value: 2, label: "หมด" },
									]}
									size="large"
								/>
							</Form.Item>
						</Col>

						<Col span={24} md={12}>
							<Form.Item
								name="publish"
								label="การมองเห็น"
								rules={[{ required: true, message: "กรุณาเลือกข้อมูล" }]}
							>
								<Switch
									checkedChildren="เปิด"
									unCheckedChildren="ปิด"
									checked={publishCheck === 1 && true}
									onChange={(e: any) => {
										form.setFieldValue("publish", e ? 1 : 2);
									}}
								/>
							</Form.Item>
						</Col>

						{/* ที่อยู่ */}
						<Col span={24}>
							<Form.Item
								name="detail"
								label="รายละเอียดเพิ่มเติม"
							>
								<Input.TextArea
									rows={2}
									size="large"
									allowClear
								/>
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

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
} from "antd";
import { useEffect, useState } from "react";
import {
	ClearOutlined,
	LockOutlined,
	PlusOutlined,
	SaveOutlined,
	UserOutlined,
} from "@ant-design/icons";
import Upload from "antd/es/upload";
import useAuthStore from "../../../store/authStore";
import { getBase64 } from "../../../utils/ImageUtils";
import { RcFile } from "antd/lib/upload";
import { useUserSave } from "../hooks/useUserMutate";
import { useUser, useUserImage } from "../hooks/useUser";
import { formUserInitial } from "../../../services/types/UserType";
type Props = {
	open: boolean;
	onCancel: () => void;
	rowId: number;
};
const { Text } = Typography;

export default function UserForm({ open, onCancel, rowId }: Props) {
	const [accessToken, user, setUser] = useAuthStore((state) => [
		state.accessToken,
		state.user,
		state.setUser,
	]);

	const [errorMsg, setErrorMsg] = useState({ status: false, message: "" });
	const [loadingSave, setLoadingSave] = useState(false);
	const [image, setImage] = useState(null);
	const [imageUrl, setImageUrl] = useState<string>();

	const [form] = Form.useForm();
	const userSave = useUserSave(accessToken);
	const { data, isLoading, refetch,isFetching } = useUser(rowId, accessToken);
	useEffect(() => {
		if (!isLoading && !isFetching ) {
			if (rowId === 0) {
				form.resetFields();
				setImageUrl("");
			} else {
				form.setFieldsValue(data);
				form.setFieldValue("password", "");
				setImageUrl(
					data?.image ? useUserImage(data?.image) : ""
				);
			}
		}
		setImage(null)
		setErrorMsg({ status: false, message: "" });
	}, [rowId, onCancel,isLoading,isFetching]);

	useEffect(()=> {
		setImage(image)
	},[image])

	// บันทึกลงฐานข้อมูล
	const onSubmit = async (data: any) => {
		try {
			setLoadingSave(true);

			rowId !== 0 ? (data.id = rowId) : null;
			image ? (data.image = image) : null;

			const res = await userSave.mutateAsync(data);

			if (res.message == "email_duplicate") {
				setErrorMsg({ status: true, message: `อีเมลนี้มีอยู่ในระบบแล้ว` });
				setLoadingSave(false);
			} else if (res.message == "user_name_duplicate") {
				setErrorMsg({ status: true, message: `ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว` });
				setLoadingSave(false);
			} else {
				notification.open({
					message: "บันทึกข้อมูลสำเร็จ",
					type: "success",
				});
				if (res.id == user?.id) {
					setUser(res);
				}
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

	//เช็คว่ารหัสผ่านกับยืนยันรหัสผ่านตรงกันหรือไม่
	const validateConfirmPassword = ({}, value: any, _: any) => {
		const password = form.getFieldValue("password");
		if (value && value !== password) {
			return Promise.reject("รหัสผ่านไม่ตรงกัน!!");
		}
		return Promise.resolve();
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
					<UserOutlined />
					{rowId == 0 ? "เพิ่มผู้ใช้" : "แก้ไขผู้ใช้"}
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
					name="user_form"
					initialValues={formUserInitial}
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
								label="อัพโหลดรูปโปรไฟล์"
								style={{ display: "flex", justifyContent: "center" }}
							>
								<Upload
									name="image"
									listType="picture-circle"
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

						{/* ชื่อผู้ใช้ */}
						<Col span={24} md={12}>
							<Form.Item
								tooltip="ชื่อผู้ใช้สำหรับล็อกอินเข้าสู่ระบบ และ ต้องเป็นภาษาอังกฤษ เท่านั้น"
								name="user_name"
								label="ชื่อผู้ใช้"
								rules={[
									{ required: true, message: "กรุณากรอกข้อมูล" },
									{ max: 50, message: "ห้ามกรอกข้อมูลเกิน 50 ตัวอักษร" },
								]}
							>
								<Input
									size="large"
									placeholder="กรุณากรอกชื่อผู้ใช้"
									allowClear
								/>
							</Form.Item>
						</Col>

						{/* อีเมล */}
						<Col span={24} md={12}>
							<Form.Item
								name="email"
								label="อีเมล"
								rules={[
									{ required: true, message: "กรุณากรอกข้อมูล" },
									{ max: 150, message: "ห้ามกรอกข้อมูลเกิน 150 ตัวอักษร" },
									{ type: "email" },
								]}
							>
								<Input size="large" placeholder="กรุณากรอกอีเมล" allowClear />
							</Form.Item>
						</Col>

						{/* ชื่อ */}
						<Col span={24} md={12}>
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
						<Col span={24} md={12}>
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

						{/* password */}
						{rowId == 0 ? (
							<>
								<Col span={24} md={12}>
									<Form.Item
										label="รหัสผ่าน"
										name="password"
										rules={[{ required: true, message: "กรุณากรอกข้อมูล" }]}
									>
										<Input.Password
											size="large"
											prefix={<LockOutlined style={{ color: "gray" }} />}
											type="password"
											placeholder="กรุณากรอกรหัสผ่าน"
										/>
									</Form.Item>
								</Col>
								<Col span={24} md={12}>
									<Form.Item
										name="confirmPassword"
										label="ยืนยันรหัสผ่าน"
										dependencies={["password"]}
										rules={[
											{ required: true, message: "กรุณากรอกข้อมูล" },
											{ max: 150, message: "ห้ามกรอกข้อมูลเกิน 150 ตัวอักษร" },
											{ validator: validateConfirmPassword },
										]}
									>
										<Input.Password
											type="password"
											size="large"
											placeholder="กรุณายืนยันรหัสผ่านอีกครั้ง"
										/>
									</Form.Item>
								</Col>
							</>
						) : null}

						{/* ระดับผู้ใช้ */}
						<Col span={24} md={12}>
							<Form.Item
								name="level"
								label="ระดับผู้ใช้"
								rules={[{ required: true, message: "กรุณาเลือกข้อมูล" }]}
							>
								<Select
									options={[
										{ value: 1, label: "Super" },
										{ value: 2, label: "Admin" },
									]}
									size="large"
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

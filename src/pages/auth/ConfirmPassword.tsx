import React, { useState } from "react";
import {
	Form,
	Input,
	Button,
	Card,
	Image,
	theme,
	Alert,
	notification,
} from "antd";
import { LockOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { FormConfirmPasswordType } from "./types";
import { authConfirmPassword } from "./hooks";
import { useNavigate, useParams } from "react-router-dom";
const { Title, Text } = Typography;

const ConfirmPasswordForm: React.FC = () => {
	const [errorMsg, setErrorMsg] = useState(false);
	const navigate = useNavigate();
	const params = useParams();
	const {
		token: { colorBgLayout },
	} = theme.useToken();

	const [form] = Form.useForm();

	const onSubmit = async (data: FormConfirmPasswordType) => {
		try {
			data.id = Number(params.id);
			const res = await authConfirmPassword(data);
			if (res) {
				notification.open({
					message: "เปลี่ยนรหัสผ่านสำเร็จ",
					description: `กรุณาเข้าสู่ระบบใหม่อีกครั้ง`,
					type: "success",
				});
				navigate("/");
			}
		} catch (error) {
			setErrorMsg(true);
		}
	};

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
				backgroundColor: colorBgLayout,
			}}
		>
			<Card style={{ width: 500 }} hoverable>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						gap: "10px",
					}}
				>
					<Image src="/logo/logo.png" width={55} alt="logo" preview={false} />
					<Title level={2}>MPS</Title>
				</div>
				<Title
					level={4}
					style={{
						margin: "10px 0 20px",
						textAlign: "center",
						fontWeight: 400,
					}}
				>
					เปลี่ยนรหัสผ่านใหม่
				</Title>
				{errorMsg && (
					<Alert
						message={
							<Text style={{ color: "black", fontSize: "1.2rem" }}>
								มีบางอย่างผิดพลาด
							</Text>
						}
						description={
							<Text style={{ color: "black" }}>
								โปรดลองอีกครั้ง หรือติดต่อผู้ดูแลระบบ
							</Text>
						}
						type="error"
						closable
						showIcon
						onClose={() => setErrorMsg(false)}
						style={{ marginBottom: "10px" }}
					/>
				)}

				<Form
					form={form}
					name="confirmpassword"
					initialValues={{ remember: true }}
					onFinish={onSubmit}
					layout="vertical"
				>
					<Form.Item
						label="รหัสผ่านใหม่"
						name="password"
						rules={[{ required: true, message: "กรุณากรอกข้อมูล" }]}
					>
						<Input.Password
							size="large"
							prefix={<LockOutlined style={{ color: "gray" }} />}
							type="password"
							placeholder="กรุณากรอกรหัสผ่านใหม่"
						/>
					</Form.Item>
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							className="login-form-button"
							block
							size="large"
						>
							ยืนยัน
						</Button>
						<Button
							type="text"
							block
							onClick={() => navigate("/login")}
							style={{ marginTop: "15px" }}
						>
							ยกเลิก
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</div>
	);
};

export default ConfirmPasswordForm;

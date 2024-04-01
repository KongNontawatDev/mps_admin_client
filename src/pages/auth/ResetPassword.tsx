import React, { useState } from "react";
import { Form, Input, Button,  Card, Image, theme, Alert, notification } from "antd";
import { UserOutlined,  MailOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { FormResetPasswordType } from "./types";
import { authResetPassword } from "./hooks";
import { useNavigate } from "react-router-dom";
const { Title,Text } = Typography;

const ResetPasswordForm: React.FC = () => {
	const [errorMsg, setErrorMsg] = useState(false);
	const navigate = useNavigate();
	const {
		token: { colorBgLayout },
	} = theme.useToken();

	const [form] = Form.useForm();

	const onSubmit = async (values: FormResetPasswordType) => {
		try {
			const res = await authResetPassword(values);
			navigate(`/confirmpassword/${res.id}`);
			notification.open({
				message: "ยืนยันตัวตนสำเร็จ",
				type:'success',
			});
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
					ยืนยันตัวตนเพื่อเปลี่ยนรหัสผ่าน
				</Title>
				{errorMsg &&
				<Alert
					message={<Text style={{color:'black',fontSize:'1.2rem'}}>มีบางอย่างผิดพลาด</Text>}
					description={<Text style={{color:'black'}}>โปรดลองอีกครั้ง หรือติดต่อผู้ดูแลระบบ</Text>}
					type="error"
					closable
					showIcon
					onClose={()=>setErrorMsg(false)}
					style={{marginBottom:'10px'}}
				/>
				}
				
				<Form
					form={form}
					name="reset_password"
					initialValues={{ remember: true }}
					onFinish={onSubmit}
					layout="vertical"
				>
					<Form.Item
						name="user_name"
						label="ชื่อผู้ใช้ : "
						rules={[
							{ required: true, message: "กรุณากรอกข้อมูล" },
							{ max: 50, message: "ห้ามกรอกข้อมูลเกิน 50 ตัวอักษร" },
						]}
					>
						<Input
							size="large"
							prefix={<UserOutlined style={{ color: "gray" }} />}
							placeholder="กรุณากรอกชื่อผู้ใช้"
						/>
					</Form.Item>
										<Form.Item
						name="email"
						label="อีเมล : "
						rules={[
							{ required: true, message: "กรุณากรอกข้อมูล" },
							{ max: 150, message: "ห้ามกรอกข้อมูลเกิน 150 ตัวอักษร" },
							{type:'email'},
						]}
					>
						<Input
							size="large"
							prefix={<MailOutlined style={{ color: "gray" }} />}
							placeholder="กรุณากรอกอีเมล"
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
							onClick={()=>navigate('/login')}
							style={{marginTop:'15px'}}
						>
							เข้าสู่ระบบ?
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</div>
	);
};

export default ResetPasswordForm;

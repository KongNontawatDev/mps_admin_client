import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Card, Image, theme, Alert, notification } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { FormLoginType } from "./types";
import { authLogin } from "./hooks";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
const { Title,Text } = Typography;

const LoginForm: React.FC = () => {
	const [errorMsg, setErrorMsg] = useState(false);
	const navigate = useNavigate();
	const [setIsLoggedIn,setAccessToken,setUser,resetAuth] = useAuthStore((state) => [state.setIsLoggedIn,state.setAccessToken,state.setUser,state.resetAuth]);
	const {
		token: { colorBgLayout },
	} = theme.useToken();

	const [form] = Form.useForm();

	const onSubmit = async (values: FormLoginType) => {
		try {
			const res = await authLogin(values);
			setIsLoggedIn(true)
			setAccessToken(res.accessToken)
			setUser(res)
			navigate("/");
			notification.open({
				message: "เข้าสู่ระบบสำเร็จ",
				description:`ยินดีต้อนรับคุณ : ${res.first_name} ${res.last_name}`,
				type:'success',
			});
		} catch (error) {
			resetAuth()
			setErrorMsg(true);
		}
		
		
	};

	// const handleForgotPassword = (e: any) => {
	// 	e.preventDefault();
	// 	console.log("Handle password recovery logic here");
	// };

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
					<Title level={2}>ระบบ MPS</Title>
				</div>
				<Title
					level={5}
					style={{
						margin: "10px 0 20px",
						textAlign: "center",
						fontWeight: 400,
					}}
				>
					ระบบเบิก/คืนวัสดุ อุปกรณ์
				</Title>
				{errorMsg &&
				<Alert
					message={<Text style={{color:'black',fontSize:'1.2rem'}}>เข้าสู่ระบบไม่สำเร็จ</Text>}
					description={<Text style={{color:'black'}}>ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง! โปรดลองอีกครั้ง</Text>}
					type="error"
					closable
					showIcon
					onClose={()=>setErrorMsg(false)}
					style={{marginBottom:'10px'}}
				/>
				}
				
				<Form
					form={form}
					name="normal_login"
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
					<Form.Item>
						<Form.Item name="remember" valuePropName="checked" noStyle>
							<Checkbox>จดจำรหัสผ่าน</Checkbox>
						</Form.Item>
						<Link
							style={{ float: "right", marginTop: "7px" }}
							className="login-form-forgot"
							to={'/resetpassword'}
						>
							ลืมรหัสผ่าน?
						</Link>
					</Form.Item>
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							className="login-form-button"
							block
							size="large"
						>
							เข้าสู่ระบบ
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</div>
	);
};

export default LoginForm;

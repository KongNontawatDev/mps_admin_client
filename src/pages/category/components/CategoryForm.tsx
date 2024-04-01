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
import {  ClearOutlined, InboxOutlined, SaveOutlined } from "@ant-design/icons";
import useAuthStore from "../../../store/authStore";
import { useCategory } from "../hooks/useCategory";
import { useCategorySave } from "../hooks/useCategoryMutate";
import { formCategoryInitial } from "../../../services/types/CategoryType";

type Props = {
	open: boolean;
	onCancel: () => void;
	rowId: number;
};

const { Text } = Typography;

export default function CategoryForm({ open, onCancel, rowId }: Props) {
	const [accessToken] = useAuthStore((state) => [state.accessToken]);

	const [errorMsg, setErrorMsg] = useState({ status: false, message: "" });
	const [loadingSave, setLoadingSave] = useState(false);

	const [form] = Form.useForm();
	const userSave = useCategorySave(accessToken);
	const { data, isLoading, refetch,isFetching } = useCategory(rowId, accessToken);

	useEffect(() => {
		if (!isLoading && !isFetching) {
			if (rowId === 0) {
				form.resetFields();
			} else {
				form.setFieldsValue(data);
			}
		}
		setErrorMsg({ status: false, message: "" });
	}, [rowId, onCancel,isFetching]);

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

	return (
		<Modal
			open={open}
			title={
				<Space>
					<InboxOutlined />
					{rowId == 0 ? "เพิ่มประเภทวัสดุ" : "แก้ไขประเภทวัสดุ"}
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
					name="category_form"
					initialValues={formCategoryInitial}
					onFinish={onSubmit}
					layout="vertical"
					style={{ marginTop: "20px" }}
				>
					<Row align={"middle"} gutter={15}>
						{/* ชื่อตำแหน่งงาน */}
						<Col span={24}>
							<Form.Item
								name="name"
								label="ชื่อหน่วยนับ"
								rules={[
									{ required: true, message: "กรุณากรอกข้อมูล" },
									{ max: 100, message: "ห้ามกรอกข้อมูลเกิน 100 ตัวอักษร" },
								]}
							>
								<Input
									size="large"
									placeholder="กรุณากรอกชื่อหน่วยนับ"
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

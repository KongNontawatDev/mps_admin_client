import {
	Alert,
	Button,
	Col,
	Form,
	Modal,
	Row,
	Space,
	Spin,
	notification,
	Typography,
	InputNumber,
} from "antd";
import { useEffect, useState } from "react";
import {  ClearOutlined, SaveOutlined, SettingOutlined } from "@ant-design/icons";
import useAuthStore from "../../../store/authStore";
import { useMaterial } from "../hooks/useMaterial";
import { useMaterialUpdateStock } from "../hooks/useMaterialMutate";
import { formMaterialInitial } from "../../../services/types/MaterialType";

type Props = {
	open: boolean;
	onCancel: () => void;
	rowId: number;
};

const { Text } = Typography;

export default function StockForm({ open, onCancel, rowId }: Props) {
	const [accessToken] = useAuthStore((state) => [state.accessToken]);

	const [errorMsg, setErrorMsg] = useState({ status: false, message: "" });
	const [loadingSave, setLoadingSave] = useState(false);

	const [form] = Form.useForm();
	const stockSave = useMaterialUpdateStock(accessToken);
	const { data, isLoading, refetch,isFetching } = useMaterial(rowId, accessToken);

	useEffect(() => {
		if (!isLoading && !isFetching) {
			if (rowId === 0) {
				form.resetFields();
			}else {
				form.setFieldValue('stock',null)
			}
		}
		setErrorMsg({ status: false, message: "" });
	}, [rowId, onCancel,isFetching]);

	// บันทึกลงฐานข้อมูล
	const onSubmit = async (formData: any) => {
		try {
			setLoadingSave(true);
			rowId !== 0 ? (formData.id = rowId) : null;
			formData.old_stock = data.stock
			formData.stock = formData.stock

			const res = await stockSave.mutateAsync(formData);

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
					<SettingOutlined />
					เพิ่มจำนวนวัสดุในสต๊อก
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
					name="material_form"
					initialValues={formMaterialInitial}
					onFinish={onSubmit}
					layout="vertical"
					style={{ marginTop: "20px" }}
				>
					<Row align={"middle"} gutter={15}>
						{/* ชื่อตำแหน่งงาน */}
						<Col span={24} >
							<Form.Item name="stock" label={<>สต๊อกเดิม ({data?.stock}) : {data?.name}</>} rules={[
									{ required: true, message: "กรุณากรอกข้อมูล" },
								]}>
								<InputNumber min={0} size="large" style={{ width: "100%" }} placeholder="จำนวนสต๊อกที่ต้องการบวกเพิ่ม" />
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

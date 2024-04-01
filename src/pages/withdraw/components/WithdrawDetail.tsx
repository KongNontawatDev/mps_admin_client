import {
	Space,
	Spin,
	Typography,
	Drawer,
	Descriptions,
	Tag,
	Image,
	Table,
	Button,
	Flex,
} from "antd";
import { useReactToPrint } from "react-to-print";
import { ManOutlined, PrinterOutlined, UnorderedListOutlined, WomanOutlined } from "@ant-design/icons";
import useAuthStore from "../../../store/authStore";
import { fallBackImage } from "../../../utils/ImageUtils";
import { useWithdraw, useWithdrawImage } from "../hooks/useWithdraw";
import { DescriptionsProps } from "antd/lib";
import { toDateTime } from "../../../utils/dateFormat";
import BadgeWithdrawStatus from "../../../components/shared/BadgeWithdrawStatus";
import { useMaterialImage } from "../../material/hooks/useMaterial";
import { useRef } from "react";
type Props = {
	open: boolean;
	onCancel: () => void;
	rowId: number;
};
const { Title } = Typography;

export default function WithdrawDetail({ open, onCancel, rowId }: Props) {
	const [accessToken] = useAuthStore((state) => [
		state.accessToken,
		state.user,
		state.setUser,
	]);
	const componentPrint = useRef(null);
	const { data, isLoading } = useWithdraw(rowId, accessToken);

	const items: DescriptionsProps["items"] = [
		{
			key: "1",
			label: "ผู้ทำรายการ",
			children: `${data?.title_name}${data?.first_name} ${data?.last_name}`,
		},
		{
			key: "2",
			label: "เพศ",
			children:
				data?.employee?.gender == "ชาย" ? (
					<Tag color="blue">
						<ManOutlined /> ชาย
					</Tag>
				) : (
					<Tag color="pink">
						<WomanOutlined /> หญิง
					</Tag>
				),
		},
		{
			key: "3",
			label: "ตำแหน่ง",
			children: `${data?.employee ? data?.employee.position : "-"}`,
		},
		{
			key: "4",
			label: "หน่วยงาน",
			children: `${data?.org?.name}`,
		},
		{
			key: "5",
			label: "จำนวน",
			children: `${data?.withdraw_detail?.length} รายการ | รวม ${data?.total_amount} ชิ้น`,
		},
		{
			key: "6",
			label: "โครงการ",
			children: `${data?.worksite ? data?.worksite : "-"}`,
		},
		{
			key: "7",
			label: "วันที่เบิก",
			children: toDateTime(data?.withdraw_date),
		},
		{
			key: "8",
			label: "หมายเหตุ",
			children: `${data?.note ? data?.note : "-"}`,
		},
		{
			key: "9",
			label: "ประเภท",
			children: BadgeWithdrawStatus(data?.status),
		},
	];

	const printQrcode = useReactToPrint({
		content: () => componentPrint.current,
		documentTitle: `พิมพ์ รายละเอียด`,
		onAfterPrint: () => onCancel(),
		pageStyle:"1,1rem",
		bodyClass:"print"
	});

	return (
		<Drawer
			open={open}
			size="large"
			title={
				<Space>
					<UnorderedListOutlined />
					{data?.status == 1 ? "รายละเอียดการเบิก" : "รายละเอียดการคืน"}
				</Space>
			}
			onClose={onCancel}
			extra={
				<Space>
					<Button type="primary" onClick={()=>printQrcode()} icon={<PrinterOutlined />}>สั่งพิมพ์</Button>
				</Space>
			}
		>
			<Spin tip="กำลังโหลด" size="large" spinning={isLoading}>
				<div ref={componentPrint}>
					<Descriptions
						items={items}
						column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
					/>
					<center style={{ marginBottom: 15 }}>
						<Flex align="center" justify="space-evenly" >
<Image
							src={useWithdrawImage(data?.image)}
							width={150}
							height={150}
							fallback={fallBackImage}
							style={{ objectFit: "cover" }}
						/>
						<Image
							src={useWithdrawImage(data?.image2)}
							width={150}
							height={150}
							fallback={fallBackImage}
							style={{ objectFit: "cover" }}
						/>
						</Flex>
						
					</center>
					<Title level={5}>รายการวัสดุ</Title>
					<Table
						columns={[
							{
								title: "SKU",
								dataIndex: "sku",
								width: 70,
								render: (_, { material: { sku } }) => <>{sku}</>,
							},
							{
								title: "",
								dataIndex: "image",
								key: "image",
								width: 50,
								align: "center",
								render: (_, { material: { image } }) => (
									<Image
										src={useMaterialImage(image)}
										width={50}
										height={50}
										fallback={fallBackImage}
										style={{ objectFit: "cover" }}
									/>
								),
							},
							{
								title: "ชื่อวัสดุ",
								dataIndex: "name",
								render: (_, { material: { name } }) => <>{name}</>,
							},
							{
								title: "ประเภท",
								dataIndex: "category",
								render: (
									_,
									{
										material: {
											category: { name },
										},
									}
								) => <>{name}</>,
							},
							{
								title: "จำนวน",
								dataIndex: "amoutn",
								width: 70,
								align: "center",
								render: (_, { amount }) => <>{amount}</>,
							},
						]}
						loading={isLoading}
						dataSource={data?.withdraw_detail}
						rowKey="id"
						bordered
						style={{ minHeight: "200px", overflowX: "auto" }}
						locale={{
							triggerDesc: "เรียงจากมากไปน้อย",
							triggerAsc: "เรียงจากน้อยไปมาก",
							cancelSort: "ยกเลิกการจัดเรียง",
						}}
						pagination={false}
					/>
				</div>
			</Spin>
		</Drawer>
	);
}

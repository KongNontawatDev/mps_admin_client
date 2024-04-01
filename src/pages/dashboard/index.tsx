import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	CategoryScale,
	BarElement,
	LinearScale,
	Legend,
} from "chart.js";
import {
	Avatar,
	Card,
	Col,
	Flex,
	Result,
	Row,
	Space,
	Typography,
	theme,
} from "antd";
import {
	DollarOutlined,
	FileDoneOutlined,
	UsergroupAddOutlined,
	WalletOutlined,
} from "@ant-design/icons";
import { useDashboards } from "./hooks";
import useAuthStore from "../../store/authStore";
import { numberFormat } from "../../utils/numberFormat";

const { Title, Text } = Typography;

type Props = {};
ChartJS.register(
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	BarElement,
	LinearScale
);

export default function Dashboard({}: Props) {
	const [accessToken] = useAuthStore((state) => [state.accessToken]);

	const { data, isLoading } = useDashboards(accessToken);
	const {
		token: {
			colorPrimaryBgHover,
			colorPrimary,
			colorSuccess,
			colorSuccessBg,
			// colorWarning,
			colorInfo,
			colorInfoBg,
			colorError,
			colorErrorBg,
		},
	} = theme.useToken();
	// const COLORS = [
	// 	colorPrimary,
	// 	colorWarning,
	// 	colorInfo,
	// 	colorError,
	// 	colorSuccess,
	// ];
	// const COLORS2 = [colorSuccess, colorInfo, colorError];


	return (
		<>
			<Row style={{ marginTop: "20px" }} gutter={[15, 15]}>
				<Col span={24} lg={12} xl={6}>
					<Card loading={isLoading}>
						<Space
							style={{ display: "flex", justifyContent: "space-between" }}
							align="center"
						>
							<Avatar
								style={{
									backgroundColor: colorPrimaryBgHover,
									color: colorPrimary,
								}}
								size={60}
								icon={<UsergroupAddOutlined />}
							/>

							<div>
								<Title
									style={{ margin: 0, color: colorPrimary, textAlign: "end" }}
								>
									{numberFormat(data?.material)}
								</Title>
								<Text style={{ fontSize: "18px" }}>จำนวนวัสดุ อุปกรณ์</Text>
							</div>
						</Space>
					</Card>
				</Col>
				<Col span={24} lg={12} xl={6}>
					<Card loading={isLoading}>
						<Space
							style={{ display: "flex", justifyContent: "space-between" }}
							align="center"
						>
							<Avatar
								style={{ backgroundColor: colorInfoBg, color: colorInfo }}
								size={60}
								icon={<FileDoneOutlined />}
							/>

							<div>
								<Title
									style={{ margin: 0, color: colorInfo, textAlign: "end" }}
								>
									{numberFormat(data?.employee)}
								</Title>
								<Text style={{ fontSize: "18px" }}>จำนวนพนักงาน</Text>
							</div>
						</Space>
					</Card>
				</Col>
				<Col span={24} lg={12} xl={6}>
					<Card loading={isLoading}>
						<Space
							style={{ display: "flex", justifyContent: "space-between" }}
							align="center"
						>
							<Avatar
								style={{ backgroundColor: colorErrorBg, color: colorError }}
								size={60}
								icon={<WalletOutlined />}
							/>

							<div>
								<Title
									style={{ margin: 0, color: colorError, textAlign: "end" }}
								>
									{numberFormat(data?.org)}
								</Title>
								<Text style={{ fontSize: "18px" }}>จำนวนหน่วยงาน</Text>
							</div>
						</Space>
					</Card>
				</Col>
				<Col span={24} lg={12} xl={6}>
					<Card loading={isLoading}>
						<Space
							style={{ display: "flex", justifyContent: "space-between" }}
							align="center"
						>
							<Avatar
								style={{ backgroundColor: colorSuccessBg, color: colorSuccess }}
								size={60}
								icon={<DollarOutlined />}
							/>

							<div>
								<Title
									style={{ margin: 0, color: colorSuccess, textAlign: "end" }}
								>
									{numberFormat(data?.withdraw)}
								</Title>
								<Text style={{ fontSize: "18px" }}>เบิกไปแล้ว</Text>
							</div>
						</Space>
					</Card>
				</Col>
			</Row>

			<Row style={{ marginTop: "20px" }} gutter={[15, 15]}>

				<Flex align="center" justify="center" style={{ width: "100%" }}>
					<Result
						status="success"
						title="ยินดีต้อนรับเข้าสู่ ระบบเบิก/คืนวัสดุ อุปกรณ์"
						subTitle=""
					/>
				</Flex>
			</Row>
		</>
	);
}

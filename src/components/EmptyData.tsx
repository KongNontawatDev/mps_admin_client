import { Empty, Typography } from "antd";

type Props = {};
const { Text } = Typography;

export default function EmptyData({}: Props) {
	return (
		<Empty
			image={Empty.PRESENTED_IMAGE_SIMPLE}
			description={<Text type="secondary">ไม่พบข้อมูล</Text>}
		></Empty>
	);
}

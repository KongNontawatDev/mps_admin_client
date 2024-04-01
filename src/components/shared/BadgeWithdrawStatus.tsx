import { Tag } from "antd";
import { withdrawStatus } from "../../services/status";
import {
	PlusCircleOutlined,
	MinusCircleOutlined,
	CheckCircleOutlined,
	QuestionCircleOutlined,
} from "@ant-design/icons";

export default function BadgeWithdrawStatus(status: number) {
	if (status == 1) {
		return (
			<Tag
				bordered={false}
				color={withdrawStatus(status).color}
				icon={<PlusCircleOutlined />}
			>
				{withdrawStatus(status).label}
			</Tag>
		);
	} else if (status == 2) {
		return (
			<Tag
				bordered={false}
				color={withdrawStatus(status).color}
				icon={<MinusCircleOutlined />}
			>
				{withdrawStatus(status).label}
			</Tag>
		);
	} else if (status == 3) {
		return (
			<Tag
				bordered={false}
				color={withdrawStatus(status).color}
				icon={<CheckCircleOutlined />}
			>
				{withdrawStatus(status).label}
			</Tag>
		);
	} else {
		return (
			<Tag
				bordered={false}
				color={withdrawStatus(status).color}
				icon={<QuestionCircleOutlined />}
			>
				{withdrawStatus(status).label}
			</Tag>
		);
	}
}

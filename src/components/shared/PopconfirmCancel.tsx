import { CloseOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";
import  { ReactNode } from "react";

type Props = {
	children: ReactNode;
	title: string;
  onConfirm:any
	disabled?:boolean
};

export default function PopconfirmCancel({ children, title,onConfirm,disabled=false }: Props) {
	return (
		<Popconfirm
			title="ยกเลิกข้อมูล"
			description={`คุณแน่ใจหรือไม่ ที่จะยกเลิก${title}`}
			okText="ใช่, ยกเลิกเลย"
			cancelText="ยกเลิก"
			icon={<CloseOutlined style={{ color: "red" }} />}
      onConfirm={onConfirm}
			disabled={disabled}
		>
			{children}
		</Popconfirm>
	);
}

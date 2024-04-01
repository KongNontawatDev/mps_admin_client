import { DeleteOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";
import  { ReactNode } from "react";

type Props = {
	children: ReactNode;
	title: string;
  onConfirm:()=>Promise<void>
	disabled?:boolean
};

export default function PopconfirmDelete({ children, title,onConfirm,disabled=false }: Props) {
	return (
		<Popconfirm
			title="ลบข้อมูล"
			description={`คุณแน่ใจหรือไม่ ที่จะลบ : ${title ? title : ""}`}
			okText="ใช่, ลบเลย"
			cancelText="ยกเลิก"
			icon={<DeleteOutlined style={{ color: "red" }} />}
      onConfirm={onConfirm}
			disabled={disabled}
		>
			{children}
		</Popconfirm>
	);
}

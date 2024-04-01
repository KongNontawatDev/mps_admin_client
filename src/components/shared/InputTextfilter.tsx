import { Form, Input } from "antd";
import React from "react";

type Props = {
	value: string;
	placeholder?: string;
	allowClear?: boolean;
	onSearch?: () => void;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onPressEnter?: () => void;
	label?: string;
};

const { Search } = Input;

export default function Inputtextfilter({
	value,
	placeholder = "กรอกคำค้นหา",
	allowClear = true,
	onSearch,
	onChange,
	onPressEnter,
	label,
}: Props) {
  
	return (
		<Form layout="vertical" >
			<Form.Item label={label} >
				<Search
					autoFocus
					value={value}
					placeholder={placeholder}
					allowClear={allowClear}
					onSearch={onSearch}
					onChange={onChange}
					onPressEnter={onPressEnter}
				/>
			</Form.Item>
		</Form>
	);
}

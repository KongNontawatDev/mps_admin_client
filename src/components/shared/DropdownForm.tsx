import {  Select } from "antd";

type Props = {
  options:object[]
  placeholder?:string
  onChange?:any
  value?:any
  loading?:boolean
  fieldValue?:string
  fieldLabel?:string
};


export default function DropdownForm({value,options,placeholder,onChange,loading=false,fieldLabel="label",fieldValue="value",...rest}: Props) {
  const mapOption = options?.map((item:any)=>{
    return {
      label:item[fieldLabel],
      value:item[fieldValue]
    }
  })
	return (
      <Select
			size="large"
      value={value==''||value==0?undefined:value}
			showSearch
			placeholder={placeholder}
			onChange={onChange}
			allowClear
			style={{ width: "100%" }}
			filterOption={(input, option) =>
				(option?.label ?? "").toLowerCase().includes(input.toLowerCase())
			}
			options={mapOption}
      loading={loading}
      {...rest}
		>
    </Select>
	);
}

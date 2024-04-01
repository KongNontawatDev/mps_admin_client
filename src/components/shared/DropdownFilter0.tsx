import { Form, Select } from "antd";
import {useEffect} from 'react';

type Props = {
  options:object[]
  placeholder?:string
  onChange:any
  value:any
  loading?:boolean
  fieldValue?:string
  fieldLabel?:string
  label:string
  name:string
};


export default function DropdownFilter0({name,value,options,placeholder,onChange,loading=false,fieldLabel="label",fieldValue="value",label,...rest}: Props) {
	const [form] = Form.useForm()
  const mapOption = options?.map((item:any)=>{
    return {
      label:item[fieldLabel],
      value:item[fieldValue]
    }
  })
  useEffect(()=>{
    if(value != '' || value != null) {
      form.setFieldValue(name,value)
    }else {
      form.setFieldValue(name,undefined)
    }
  },[value])
  
	return (
		<Form layout="vertical" name={`dropdown-filter${name}`} form={form}>
      <Form.Item label={label} name={name}>
      <Select
      value={value != null || value != ''?value:undefined}
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
    </Form.Item>
    </Form>
	);
}

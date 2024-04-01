import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import buddhistEra from "dayjs/plugin/buddhistEra";
import locale from 'antd/es/date-picker/locale/th_TH';
import 'dayjs/locale/th';
import DatePicker from "../../utils/DatePicker";
import { DatePickerProps } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
dayjs.extend(customParseFormat);
dayjs.extend(buddhistEra);
dayjs.locale('th')

const datePickerTh = {
  ...locale,
  lang: {
    ...locale.lang,
    yearFormat: 'BBBB',
    dateFormat: 'M/D/BBBB',
    dateTimeFormat: 'M/D/BBBB HH:mm:ss',
  },
  dateFormat: 'BBBB-MM-DD',
  dateTimeFormat: 'BBBB-MM-DD HH:mm:ss',
  weekFormat: 'BBBB-wo',
  monthFormat: 'BBBB-MM',
  yearFormat:"BBBB"
};

type Props = {
  placeholder?:string
  onChange?:any
  value?:any
  placement?:DatePickerProps['placement']
  picker?:any
  size?:SizeType
  format?:any
};

export default function InputDate({format="DD/MM/BBBB",placeholder='เลือกวันที่',onChange,value,placement="bottomLeft",picker="date",size="large"}: Props) {
	return (
		<DatePicker
			format={format}
			style={{ width: "100%" }}
			locale={datePickerTh}
      size={size}
      allowClear
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      placement={placement}
      picker={picker}
		/>
	);
}

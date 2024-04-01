import { Pagination,Typography, PaginationProps } from "antd";

interface PaginationPropsX extends PaginationProps {
  totalItem:number
  totalRecord:number
}

const {Text} = Typography

export const PaginationTable = ({current,total,onChange,totalItem,totalRecord}:PaginationPropsX) => {
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'20px',flexWrap:'wrap'}}>
      <Text>ค้นเจอ {totalItem} จากทั้งหมด {totalRecord} รายการ</Text>
      <Pagination current={current} total={total} onChange={onChange}  showSizeChanger={false}/>
    </div>
  )
}

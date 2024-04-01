import React from 'react';
import { Button, Result,Typography } from 'antd';

const { Title} = Typography

const Pagenotfound: React.FC = () => (
  <Result
    status="404"
    title={<Title level={1} >404</Title>}
    subTitle={<>
    <Title level={3} style={{fontWeight:400}}>🙏ขออภัย, ไม่พบรายการที่คุณเรียก</Title>
    </>}
    extra={<Button type="primary" href='/'>กลับไปยังหน้าแรก</Button>}
  />
);

export default Pagenotfound;
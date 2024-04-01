import { Tag } from 'antd'

type Props = {
  user_level:number
}

export default function BadgeUserLevel({user_level}: Props) {
  if(user_level==1) {
    return (
      <Tag bordered={false} color="magenta">
        Super
      </Tag>
    )
  }else if (user_level==2) {
    return (
      <Tag bordered={false} color="success">
        Admin
      </Tag>
    )
  }else {
    return (
      <Tag bordered={false} color='blue'>
        ไม่รู้จัก
      </Tag>
    )
  }
}
import { Breadcrumb } from 'antd'
import{ ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Item = {
  title: string|ReactNode,
  href?: string,
  icon?:ReactNode,

}

type Props ={
  listItems: Item[]
  visible?:Boolean
}
export default function BreadcrumbLink({ listItems=[],visible=true }: Props) {

  const newListItems = [{ title: 'หน้าแรก', href: '/' }, ...listItems]
  const items = newListItems.map((item) => {
    if(item.href==undefined) {
      return {title:item.title}
    }else {
      return {title:<Link to={item.href!}>{item.icon} {item.title}</Link>}
    }
  })

  return (
    <Breadcrumb
    style={{display:visible?'flex':'none',alignItems:'center',justifyContent:'end'}}
    items={items}
  />
  )
}
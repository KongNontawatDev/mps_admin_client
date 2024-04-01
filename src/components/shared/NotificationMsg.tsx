import { notification } from "antd";
import { NotificationPlacement } from "antd/es/notification/interface";
import { useEffect } from "react";

type Props = {
	message: string;
	description?: string;
	type?: "success" | "info" | "warning" | "error";
  placement?:NotificationPlacement;
};

export default function NotificationMsg({message,description='',type='error',placement='bottomLeft'}: Props) {
	const [api, contextHolder] = notification.useNotification();

	const openNotification = () => {
		api[type]({
			message,
			description,
			duration: type=='success'?3:5,
      placement
		});
	};
  useEffect(()=>{openNotification()},[message,description,type])
	return <>{contextHolder}</>;
}

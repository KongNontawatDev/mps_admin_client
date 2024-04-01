import { Suspense } from "react";
import EmptyLoading from "../pages/EmptyLoading";
import { Outlet } from "react-router-dom";

type Props = {};

export default function AuthLayout({}: Props) {
	return (
		<>
			<Suspense fallback={<EmptyLoading />}>
				<Outlet />
			</Suspense>
		</>
	);
}

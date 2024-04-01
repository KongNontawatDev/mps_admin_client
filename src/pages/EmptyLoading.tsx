import { Card, Col, Row, Skeleton } from "antd";

type Props = {};

export default function EmptyLoading({}: Props) {
	return (
		<>
			<Row align={"middle"} style={{ margin: "25px 0 10px" }}>
				<Col span={12}>
					<Skeleton.Input active />
				</Col>
				<Col span={12} style={{ textAlign: "end" }}>
					<Skeleton.Input active />
				</Col>
			</Row>
			<Card
				title={
					<Row align={"middle"}>
						<Col span={12}>
							<Skeleton.Input active />
						</Col>
						<Col span={12} style={{ textAlign: "right" }}>
							
							<Skeleton.Input active />
						</Col>
					</Row>
				}
			>
				<Skeleton active />
				<Skeleton active />
				<Skeleton active />
			</Card>
		</>
	);
}

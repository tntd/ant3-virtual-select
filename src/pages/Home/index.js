/*
 * @Describe: 测试首页
 */

import "./index.less";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button } from "antd";
import VirtualSelect from "@/components/VirtualSelect";
import TestModal from "./TestModal";
import ComSelect from "./ComSelect";
import SuperSelect from "@/components/SuperSelect";

const Option = VirtualSelect.Option;

const children = [];

for (let i = 0; i < 1000; i++) {
	children.push(
		<Option value={i} key={i}>
			{`测试${i}`}<span>123</span>
		</Option>
	);
}

const Home = props => {
	const { globalStore, homeStore } = props;
	const [type, setType] = useState();

	useEffect(() => {
		init();
		setType(1);
	}, []);

	const init = () => {
		dispatch({
			type: "global/updateState",
			payload: {
				count: 2
			}
		});
		dispatch({
			type: "home/updateState",
			payload: {
				homeCount: 2
			}
		});
	};

	const handleChange = (e) => {
		console.log(e);
	};

	const [visible, setVisible] = useState(false);

	return (
		<div className="g-home">
			{/* <SuperSelect
				showSearch
				optionFilterProp="children"
				allowClear
				placeholder="请选择"
				style={{ width: 200 }}
			>
				{children}
			</SuperSelect> */}
			<div className="wrap">
				<VirtualSelect
					className="u-width"
					showSearch
					optionFilterProp="children"
					allowClear
					placeholder="请选择"
					onChange={handleChange}
					// style={{ width: "200px" }}
					dropdownMatchSelectWidth={false}
					maxWidth={400}
					defaultValue={500}
				// getPopupContainer={target => target.parentNode}
				>
					<Option value="chizhidngah">处置方式</Option>
					{children}
				</VirtualSelect>
			</div>
			<Button onClick={() => setVisible(true)}>弹框</Button>
			{
				visible &&
				<TestModal
					visible={visible}
					onCancel={() => setVisible(false)}
				/>
			}
			<ComSelect />
			<div>
				<VirtualSelect
					showSearch
					optionFilterProp="children"
					allowClear
					placeholder="请选择"
					// onChange={handleChange}
					style={{ width: "150px" }}
				// dropdownMatchSelectWidth={false}
				// maxWidth={400}
				// defaultValue={500}
				// getPopupContainer={target => target.parentNode}
				>
					<Option value="chizhidngah">处置方式</Option>
					{
						type === 1 &&
						<Option value="chizhidngah2">处置方式2</Option>
					}
					{
						type === 2 &&
						<Option value="chizhidngah3">处置方式3</Option>
					}
				</VirtualSelect>
			</div>
			<VirtualSelect
				showSearch
				optionFilterProp="children"
				style={{ width: "300px" }}
				mode="multiple"
				// optionFilterProp="children"
				// filterOption={(input, option) => option?.props?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0}
				// value={text || []}
				maxCount={3}
			>
				{children}
			</VirtualSelect>
		</div>
	);
};

const mapStateToProps = (state) => ({
	globalStore: state.global,
	homeStore: state.home
});

export default connect(mapStateToProps)(Home);


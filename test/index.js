import ReactDOM from "react-dom";
import VirtualSelect from "../src/components/VirtualSelect";
const Option = VirtualSelect.Option;

const VSelect = () => {
	const children = [];
	for (let i = 0; i < 1000; i++) {
		children.push(
			<Option value={i} key={i}>
				{`测试${i}`}<span>123</span>
			</Option>
		);
	}

	const handleChange = (e) => {
		console.log(e);
	};

	return (
		<VirtualSelect
			className="u-width"
			showSearch
			optionFilterProp="children"
			allowClear
			placeholder="请选择"
			onChange={handleChange}
			dropdownMatchSelectWidth={false}
			maxWidth={400}
			defaultValue={500}
		>
			<Option value="chizhidngah">处置方式</Option>
			{children}
		</VirtualSelect>
	);
};

ReactDOM.render(<VSelect />, document.getElementById("app"));

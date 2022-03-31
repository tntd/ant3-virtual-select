/*
 * @CreatDate: 2021-03-19 09:48:09
 * @Describe: 基于ant3版本封装的高性能下拉框组件
 */

import "./index.less";
import { useEffect, useState, useCallback } from "react";
import { Select, Empty } from "antd";
import { List } from "react-virtualized";
import clonedeep from "lodash.clonedeep";

export default props => {
	const { children = [] } = props;
	const [copyChild, setCopyChild] = useState([]);

	useEffect(() => {
		setCopyChild(clonedeep(children));
	}, [children]);

	const rowRenderer = useCallback(
		({ key, index, style }) => {
			const option = copyChild[index];
			return (
				<div
					key={key}
					style={style}
					className="virtual-option"
				>
					{option.props.children}--12
				</div>
			);
		},
		[copyChild],
	);

	return (
		<Select
			{...props}
			dropdownRender={() => (
				<div onMouseDown={e => e.preventDefault()}>
					<List
						width={200}
						height={224}
						rowCount={copyChild.length}
						rowHeight={32}
						rowRenderer={rowRenderer}
					/>
				</div>
			)}
		/>
	);
};

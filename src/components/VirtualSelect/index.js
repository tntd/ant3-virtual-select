import React, { PureComponent } from "react";
import { Select, Empty } from "tntd";
import DropDownWrap from "./DropDownWrap";

// 页面实际渲染的下拉菜单数量，实际为 2 * ITEM_ELEMENT_NUMBER
const ITEM_ELEMENT_NUMBER = 30;
// Select size 配置
const ITEM_HEIGHT_CFG = {
	small: 24,
	large: 40,
	default: 32
};

const ARROW_CODE = {
	40: "down",
	38: "up"
};

const DROPDOWN_HEIGHT = 224;

const Option = Select.Option;

class SuperSelect extends PureComponent {
	constructor(props) {
		super(props);

		const { mode, defaultValue, value, optionHeight, children: arr } = props;
		this.isMultiple = ["tags", "multiple"].includes(mode);
		const children = this.turnChildren(arr);

		// 设置默认 value
		let defaultV = this.isMultiple ? [] : "";
		defaultV = value || defaultValue || defaultV;

		this.state = {
			children: children || [],
			filterChildren: null, // 筛选后的 options，优先显示，所以清除筛选后手动设为 null
			value: defaultV,
			maxWidth: null,
			selectWidth: null
		};
		// 下拉菜单项行高
		this.ITEM_HEIGHT = optionHeight || ITEM_HEIGHT_CFG[props.size || "default"];
		// 可视区 dom 高度
		this.visibleDomHeight = this.ITEM_HEIGHT * ITEM_ELEMENT_NUMBER;
		// 滚动时重新渲染的 scrollTop 判断值，大于 reactDelta 则刷新下拉列表
		this.reactDelta = this.visibleDomHeight / 3;
		// 是否拖动滚动条快速滚动状态
		this.isStopReact = false;
		// 上一次滚动的 scrollTop 值
		this.prevScrollTop = 0;
		// 上一次按下方向键时 scrollTop 值
		this.prevTop = 0;

		this.scrollTop = 0;

		// className
		this.dropdownClassName = `dc${+new Date()}`;

		this.id = `sid${+new Date()}`;

	}

	componentDidMount() {
		// defaultOpens=true 时添加滚动事件
		setTimeout(() => {
			this.addEvent();
		}, 500);
		const { children: arr } = this.props;
		const children = this.turnChildren(arr);
		// if (children && children.length > 0) {
		this.formulaWidth();
		// }
	}

    turnChildren = (children) => {
    	if (!children) return [];
    	let arr = [];
    	if (children && children.props) {
    		arr.push(children);
    	} else {
    		if (children && children.length > 0) {
    			children.forEach(item => {
    				if (item) {
    					if (item instanceof Array) {
    						arr = arr.concat(item);
    					} else {
    						arr.push(item);
    					}
    				}
    			});
    		}
    	}
    	return arr;
    }

    formulaWidth = () => {
    	// 获取dom设置宽度
    	const { children: arr2, dropdownMatchSelectWidth = true, maxWidth } = this.props;
    	const selectDom = document.getElementById(this.id);
    	const selectWidth = selectDom.clientWidth || selectDom.offsetWidth;
    	let arr = [];
    	let formulaMaxWidth = 10;
    	if (!dropdownMatchSelectWidth) {
    		formulaMaxWidth = maxWidth || 10;
    	}
    	if (!dropdownMatchSelectWidth && !maxWidth) {
    		if (arr2 && arr2.length > 0) {
    			const children = this.turnChildren(arr2);
    			for (let i = 0; i < children.length; i++) {
    				const val = children[i].props.children;
    				const textWidth = this.getTextPixelWith(val);
    				arr.push(textWidth.toFixed(2));
    			}
    			if (arr.length > 0) {
    				formulaMaxWidth = Math.max(...arr);
    			}
    		}

    	}

    	this.setState({
    		selectWidth,
    		maxWidth: formulaMaxWidth
    	});
    }

    // 获取单行文本的像素宽度
    getTextPixelWith = (text, fontStyle = "14px") => {
    	let canvas = document.createElement("canvas"); // 创建 canvas 画布
    	let context = canvas.getContext("2d"); // 获取 canvas 绘图上下文环境
    	context.font = fontStyle; // 设置字体样式，使用前设置好对应的 font 样式才能准确获取文字的像素长度
    	let dimension = context.measureText(text); // 测量文字
    	return dimension.width;
    }

    componentDidUpdate(prevProps) {
    	const { mode, defaultValue, value, children } = this.props;
    	let arr = this.turnChildren(children);
    	if (prevProps.children !== children) {
    		this.isMultiple = ["tags", "multiple"].includes(mode);

    		this.setState({
    			children: arr || [],
    			filterChildren: null
    		});

			 this.setState(
                {
                    children: arr || [],
                    filterChildren: null
                },
                () => {
                    if (arr && arr.length > 0) {
                        // 设置下拉列表显示数据
                        if (!value) {
                            this.scrollTop = 0;
                            this.scrollEle && this.scrollEle.scrollTo(0, 0);
                            this.setSuperDrowDownMenu(true);
                        }
						this.formulaWidth();
						this.removeEvent();
						this.addEvent();
                    }
                }
            );
    	}
    	if (prevProps.value !== value) {
    		// 更新时设置默认 value
    		let defaultV = this.isMultiple ? [] : "";
    		defaultV = value || defaultValue || defaultV;
    		this.setState({ value: defaultV });
    	}
    }

    componentWillUnmount() {
    	this.removeEvent();
    }

    getItemStyle = i => ({
    	position: "absolute",
    	top: this.ITEM_HEIGHT * i,
    	width: "100%",
    	height: this.ITEM_HEIGHT
    });

    preventEvent = (e) => {
        e.preventDefault();
    }
    addEvent = () => {
    	this.scrollEle = document.querySelector(`.${this.dropdownClassName}`);
    	// 下拉菜单未展开时元素不存在
    	if (!this.scrollEle) return;

        this.scrollEle.addEventListener('mousedown',this.preventEvent, false);

    	this.scrollEle.addEventListener("scroll", this.onScroll, false);
    	this.inputEle = document.querySelector(`#${this.id}`);

    	if (!this.inputEle) return;
    	this.inputEle.addEventListener("keydown", this.onKeyDown, false);
    };

    // 模拟 antd select 按下 上下箭头 键时滚动列表
    onKeyDown = e => {
    	const { keyCode } = e || {};

    	setTimeout(() => {
    		const activeItem = document.querySelector(
    			`.${this.dropdownClassName} .ant-select-dropdown-menu-item-active`
    		);
    		if (!activeItem) return;

    		const { offsetTop } = activeItem;
    		const isUp = ARROW_CODE[keyCode] === "up";
    		const isDown = ARROW_CODE[keyCode] === "down";

    		// 在所有列表第一行按上键
    		if (offsetTop - this.prevTop > DROPDOWN_HEIGHT && isUp) {
    			this.scrollEle.scrollTo(0, this.allHeight - DROPDOWN_HEIGHT);
    			this.prevTop = this.allHeight;

    			return;
    		}

    		// 在所有列表中最后一行按下键
    		if (this.prevTop > offsetTop + DROPDOWN_HEIGHT && isDown) {
    			this.scrollEle.scrollTo(0, 0);
    			this.prevTop = 0;

    			return;
    		}

    		this.prevTop = offsetTop;
    		// 向下滚动到下拉框最后一行时，向下滚动一行的高度
    		if (
    			offsetTop >
                this.scrollEle.scrollTop + DROPDOWN_HEIGHT - this.ITEM_HEIGHT + 10 &&
                isDown
    		) {
    			this.scrollEle.scrollTo(0, this.scrollTop + this.ITEM_HEIGHT);
    			return;
    		}
    		// 向上滚动到下拉框第一一行时，向上滚动一行的高度
    		if (offsetTop < this.scrollEle.scrollTop && isUp) {
    			this.scrollEle.scrollTo(0, this.scrollTop - this.ITEM_HEIGHT);
    		}
    	}, 100);
    };

    onScroll = () => this.throttleByHeight(this.onScrollReal);

    onScrollReal = () => {
    	this.allList = this.getUseChildrenList();
    	const { startIndex, endIndex } = this.getStartAndEndIndex();

    	this.prevScrollTop = this.scrollTop;
    	// 重新渲染列表组件 Wrap
    	const allHeight = this.allList.length * this.ITEM_HEIGHT || 100;
    	this.wrap.reactList(allHeight, startIndex, endIndex);
    };

    throttleByHeight = () => {
    	this.scrollTop = this.scrollEle.scrollTop;
    	// 滚动的高度
    	let delta = this.prevScrollTop - this.scrollTop;
    	delta = delta < 0 ? 0 - delta : delta;

    	delta > this.reactDelta && this.onScrollReal();
    };

    // 列表可展示所有 children
    getUseChildrenList = () => this.state.filterChildren || this.state.children;

    getStartAndEndIndex = () => {
    	// 滚动后显示在列表可视区中的第一个 item 的 index
    	const showIndex = Number((this.scrollTop / this.ITEM_HEIGHT).toFixed(0));

    	const startIndex =
            showIndex - ITEM_ELEMENT_NUMBER < 0
            	? 0
            	: showIndex - ITEM_ELEMENT_NUMBER / 2;
    	const endIndex = showIndex + ITEM_ELEMENT_NUMBER;
    	return { startIndex, endIndex };
    };

    // 须使用 setTimeout 确保在 dom 加载完成之后添加事件
    setSuperDrowDownMenu = visible => {
    	if (!visible) return;

    	this.allList = this.getUseChildrenList();

    	if (!this.eventTimer || !this.scrollEle) {
    		this.eventTimer = setTimeout(() => this.addEvent(), 0);
    	} else {
    		const allHeight = this.allList.length * this.ITEM_HEIGHT || 100;
    		// 下拉列表单独重新渲染
    		const { startIndex, endIndex } = this.getStartAndEndIndex();
    		setTimeout(() => {
    			this.wrap && this.wrap.reactList(allHeight, startIndex, endIndex);
    		}, 0);
    	}
    };

    onDropdownVisibleChange = visible => {
    	const { onDropdownVisibleChange } = this.props;
    	onDropdownVisibleChange && onDropdownVisibleChange(visible);

    	const { value, children } = this.state;
    	// 关闭下拉框前清空筛选条件，防止下次打开任然显示筛选后的 options
    	if (!visible) {
    		// 定时器确保关闭后再设置 filterChildren,防止列表刷新闪烁
    		setTimeout(() => {
    			this.setState({ filterChildren: null });
    			this.setDefaultScrollTop(value);
    		}, 100);
    		// this.removeEvent();
    	} else {
    		// this.addEvent();
    		if (value) {
    			// 如果已有 value, 设置默认滚动位置
    			this.setDefaultScrollTop();
    			// 设置下拉列表显示数据
    			this.setSuperDrowDownMenu(visible);
    		} else if (!value && value !== 0 && children && children.length > 0) { // 无数据时，下拉回归至第一个
    			const val = children[0].props.value;
    			this.setDefaultScrollTop(val);
    		}
    	}
    };

    onDeselect = value => {
    	const { onDeselect } = this.props;
    	onDeselect && onDeselect(value);
    };

    // 在搜索重新计算下拉滚动条高度
    onChange = (value, opt) => {
    	const { showSearch, onChange, autoClearSearchValue, maxCount, mode } = this.props;
    	if (showSearch || this.isMultiple) {
    		// 搜索模式下选择后是否需要重置搜索状态
    		if (autoClearSearchValue !== false) {
    			this.setState({ filterChildren: null }, () => {
    				// 搜索成功后重新设置列表的总高度
    				this.setSuperDrowDownMenu(true);
    			});
    		}
    	}

    	if (mode === "multiple") {
    		if (value.length <= maxCount) {
    			this.setState({ value });
    		}
    	} else {
    		this.setState({ value });
    	}
    	onChange && onChange(value, opt);

    	if (mode !== "multiple") {
    		this.select &&
                this.select.blur();
    	}
    };

    onSearch = v => {
    	const { showSearch, onSearch, filterOption, children: arr } = this.props;
    	let children = this.turnChildren(arr);
    	if (showSearch && filterOption !== false) {
    		// 须根据 filterOption（如有该自定义函数）手动 filter 搜索匹配的列表
    		let filterChildren = null;
    		if (typeof filterOption === "function") {
    			filterChildren = children.filter(item => filterOption(v, item));
    		} else if (filterOption === undefined) {
    			filterChildren = children.filter(item => this.filterOption(v, item));
    		}

    		// 搜索框有值，去除disabled=true的children
    		let newFilterChild = [];
    		filterChildren &&
                filterChildren.forEach((item, index) => {
                	if (!item.props.disabled) {
                		newFilterChild.push(item);
                	}
                });
    		filterChildren = newFilterChild;

    		// 设置下拉列表显示数据
    		this.setState(
    			{ filterChildren: v === "" ? null : filterChildren },
    			() => {
    				setTimeout(() => {
    					// 搜索后需要重置滚动位置到0，防止上次 scrollTop 位置无数据
    					if (filterChildren) {
    						this.scrollTop = 0;
    						this.scrollEle.scrollTo(0, 0);
    					}
    					// 搜索成功后需要重新设置列表的总高度
    					this.setSuperDrowDownMenu(true);
    				}, 0);
    			}
    		);
    	}
    	onSearch && onSearch(v);
    };

    filterOption = (v, option) => {
    	// 自定义过滤对应的 option 属性配置
    	const filterProps = this.props.optionFilterProp || "value";
    	return `${option.props[filterProps]}`.indexOf(v) >= 0;
    };

    setDefaultScrollTop = (data) => {
    	const { value } = this.state;
    	const { children: arr } = this.props;
    	const children = this.turnChildren(arr);

    	let val = (data || data === 0) ? data : value;

    	for (let i = 0; i < children.length; i++) {
    		const item = children[i];
    		const itemValue = item.props.value;
    		if (
    			itemValue === val ||
                (Array.isArray(val) && val.includes(itemValue))
    		) {
    			const targetScrollTop = i * this.ITEM_HEIGHT;

    			setTimeout(() => {
    				if (!this.scrollEle) {
    					this.addEvent();
    				}
    				this.scrollEle &&
                        this.scrollEle.scrollTo(0, targetScrollTop);
    			}, 100);
    			return;
    		}
    	}
    };

    removeEvent = () => {
    	if (!this.scrollEle) return;
    	this.scrollEle.removeEventListener("scroll", this.onScroll, false);
        this.scrollEle.removeEventListener('mousedown',this.preventEvent,false);
    	if (!this.inputEle) return;
    	this.inputEle.removeEventListener("keydown", this.onKeyDown, false);
    };

    render() {
    	const { maxWidth, selectWidth } = this.state;
    	let {
    		dropdownStyle,
    		optionLabelProp,
    		dropdownClassName,
    		...props
    	} = this.props;

    	this.allList = this.getUseChildrenList();

    	this.allHeight = this.allList.length * this.ITEM_HEIGHT || 100;
    	const { startIndex, endIndex } = this.getStartAndEndIndex();

    	let dynamicWidth = maxWidth;
    	if (this.allList.length === 0 || maxWidth < selectWidth) {
    		dynamicWidth = selectWidth;
    	}

    	dropdownStyle = {
    		maxHeight: `${DROPDOWN_HEIGHT}px`,
    		...dropdownStyle,
    		overflow: "auto",
    		position: "relative",
    		maxWidth: dynamicWidth
    	};

    	const { value } = this.state;
    	// 判断处于 antd Form 中时不自动设置 value
    	const _props = { ...props };
    	// 先删除 value，再手动赋值，防止空 value 影响 placeholder
    	delete _props.value;

    	// value 为空字符会隐藏 placeholder，改为 undefined
    	if (typeof value === "string" && !value) {
    		_props.value = undefined;
    	} else {
    		_props.value = value;
    	}

    	optionLabelProp = optionLabelProp || "children";
    	return (
    		<Select
    			{..._props}
    			id={this.id}
    			onSearch={this.onSearch}
    			onChange={this.onChange}
    			dropdownClassName={`${this.dropdownClassName} ${dropdownClassName ||
                    ""}`}
    			optionLabelProp={optionLabelProp}
    			dropdownStyle={dropdownStyle}
    			onDropdownVisibleChange={this.onDropdownVisibleChange}
    			onDeselect={this.onDeselect}
    			ref={ele => (this.select = ele)}
    			dropdownRender={(menu, props) => {
    				if (this.allList.length === 0) {
    					return <div style={{  margin:"5px auto" }}><Empty  size="mini"/></div>;
    				}

    				return (
    					<DropDownWrap
    						{...{
    							startIndex,
    							endIndex,
    							allHeight: this.allHeight,
    							menu,
    							itemHeight: this.ITEM_HEIGHT
    						}}
    						ref={ele => {
    							this.wrap = ele;
    						}}
    					/>
    				);
    			}}
    		>
    			{this.allList}
    		</Select>
    	);
    }
}

SuperSelect.Option = Option;

export default SuperSelect;

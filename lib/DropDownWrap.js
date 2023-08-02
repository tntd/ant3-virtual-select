"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var DropDownWrap = /*#__PURE__*/function (_PureComponent) {
  (0, _inherits2["default"])(DropDownWrap, _PureComponent);
  var _super = _createSuper(DropDownWrap);
  function DropDownWrap(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, DropDownWrap);
    _this = _super.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "getItemStyle", function (i) {
      var itemHeight = _this.props.itemHeight;
      return {
        position: "absolute",
        top: itemHeight * i,
        height: itemHeight,
        width: "100%"
      };
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "reactList", function (allHeight, startIndex, endIndex) {
      return _this.setState({
        allHeight: allHeight,
        startIndex: startIndex,
        endIndex: endIndex
      });
    });
    var _allHeight = props.allHeight,
      _startIndex = props.startIndex,
      _endIndex = props.endIndex;
    _this.state = {
      allHeight: _allHeight,
      startIndex: _startIndex,
      endIndex: _endIndex
    };
    return _this;
  }

  // componentDidUpdate(prevProps) {
  // 	if (this.props.allHeight !== prevProps.allHeight) {
  // 		this.setState({ allHeight: this.props.allHeight });
  // 	}
  // }

  // eslint-disable-next-line react/no-deprecated
  (0, _createClass2["default"])(DropDownWrap, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.allHeight !== nextProps.allHeight) {
        this.setState({
          allHeight: nextProps.allHeight
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var menu = this.props.menu;
      var _this$state = this.state,
        startIndex = _this$state.startIndex,
        endIndex = _this$state.endIndex,
        allHeight = _this$state.allHeight;

      // 截取 Select 下拉列表中需要显示的部分
      var cloneMenu = /*#__PURE__*/_react["default"].cloneElement(menu, {
        menuItems: menu.props.menuItems.slice(startIndex, endIndex).map(function (item, i) {
          var realIndex = (startIndex || 0) + Number(i);
          var style = _this2.getItemStyle(realIndex);

          // 未搜到数据提示高度使用默认高度
          if (item.key === "NOT_FOUND") {
            delete style.height;
          }
          return /*#__PURE__*/_react["default"].cloneElement(item, {
            style: _objectSpread(_objectSpread({}, item.props.style), style)
          });
        }),
        dropdownMenuStyle: _objectSpread(_objectSpread({}, menu.props.dropdownMenuStyle), {}, {
          height: allHeight,
          maxHeight: allHeight,
          overflow: "hidden"
        })
      });
      return cloneMenu;
    }
  }]);
  return DropDownWrap;
}(_react.PureComponent);
exports["default"] = DropDownWrap;
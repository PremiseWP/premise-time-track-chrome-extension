"use strict";
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NewTimerBtn = function (_React$Component) {
	_inherits(NewTimerBtn, _React$Component);

	function NewTimerBtn(props) {
		_classCallCheck(this, NewTimerBtn);

		var _this2 = _possibleConstructorReturn(this, (NewTimerBtn.__proto__ || Object.getPrototypeOf(NewTimerBtn)).call(this, props));

		_this2.state = { text: 'New Timer' };
		_this2.handleClick = _this2.handleClick.bind(_this2);
		return _this2;
	}

	_createClass(NewTimerBtn, [{
		key: 'handleClick',
		value: function handleClick() {
			var form = _react2.default.createElement(NewTimerForm, null);
			_reactDom2.default.render(_react2.default.createElement(
				IntoApp,
				null,
				_react2.default.createElement(NewTimerForm, null)
			), document.getElementById('app'));
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'button',
				{ onClick: this.handleClick },
				this.state.text
			);
		}
	}]);

	return NewTimerBtn;
}(_react2.default.Component);

var MyTimeBtn = function (_React$Component2) {
	_inherits(MyTimeBtn, _React$Component2);

	function MyTimeBtn(props) {
		_classCallCheck(this, MyTimeBtn);

		var _this3 = _possibleConstructorReturn(this, (MyTimeBtn.__proto__ || Object.getPrototypeOf(MyTimeBtn)).call(this, props));

		_this3.state = {
			title: 'Loading...',
			query: {
				posts: [],
				taxonomies: {}
			}
		};

		_this3.handleClick = _this3.handleClick.bind(_this3);
		return _this3;
	}

	_createClass(MyTimeBtn, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this4 = this;

			var ptt = getPTT();

			console.log('begin fecth..');

			var _this = this;
			fetch(ptt.url).then(function (r) {
				r.json().then(function (json) {
					console.log(json);
					_this4.setState({ title: 'Loaded', query: json });
				});
			});
		}
	}, {
		key: 'handleClick',
		value: function handleClick() {
			// handle
		}
	}, {
		key: 'render',
		value: function render() {
			// Iterate through the posts, build list
			var listPosts = this.state.query.posts.map(function (p) {
				return _react2.default.createElement(
					'li',
					{ key: p.id },
					p.title.rendered
				);
			});
			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'h3',
					null,
					this.state.title
				),
				_react2.default.createElement(
					'ul',
					null,
					listPosts
				),
				'Count: ',
				this.state.query.posts.length
			);
		}
	}]);

	return MyTimeBtn;
}(_react2.default.Component);

var NewTimerForm = function (_React$Component3) {
	_inherits(NewTimerForm, _React$Component3);

	function NewTimerForm() {
		_classCallCheck(this, NewTimerForm);

		return _possibleConstructorReturn(this, (NewTimerForm.__proto__ || Object.getPrototypeOf(NewTimerForm)).apply(this, arguments));
	}

	_createClass(NewTimerForm, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'form',
				null,
				_react2.default.createElement(
					'div',
					null,
					_react2.default.createElement('input', { type: 'text', name: 'title' })
				),
				_react2.default.createElement(
					'div',
					null,
					_react2.default.createElement('textarea', { name: 'content' })
				),
				_react2.default.createElement(
					'div',
					null,
					_react2.default.createElement('input', { type: 'date', name: 'post-date' })
				),
				_react2.default.createElement(
					'div',
					null,
					_react2.default.createElement('input', { type: 'number', name: 'ptt-time', min: '0', step: '0.25', placeholder: '1.75' })
				),
				_react2.default.createElement(
					'div',
					null,
					_react2.default.createElement('input', { type: 'submit', value: 'submit' })
				)
			);
		}
	}]);

	return NewTimerForm;
}(_react2.default.Component);

_reactDom2.default.render(_react2.default.createElement(NewTimerBtn, null), document.getElementById('dashboard'));

_reactDom2.default.render(_react2.default.createElement(MyTimeBtn, null), document.getElementById('dashboard'));

function IntoApp(props) {
	var _class = props.className || '';
	return _react2.default.createElement(
		'div',
		{ className: 'app-inner ' + _class },
		props.children
	);
}

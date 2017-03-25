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

/**
 * New timer button
 *
 * Dsiplays the new timer button and handles click event
 */
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
			_reactDom2.default.render(_react2.default.createElement(NewTimerForm, null), document.getElementById('app'));
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

/**
 * New timer form
 *
 * This form handles creating and editing timers.
 */


var NewTimerForm = function (_React$Component2) {
	_inherits(NewTimerForm, _React$Component2);

	function NewTimerForm(props) {
		_classCallCheck(this, NewTimerForm);

		var _this3 = _possibleConstructorReturn(this, (NewTimerForm.__proto__ || Object.getPrototypeOf(NewTimerForm)).call(this, props));

		_this3.state = {};

		_this3.handleSubmit = _this3.handleSubmit.bind(_this3);
		return _this3;
	}

	_createClass(NewTimerForm, [{
		key: 'handleSubmit',
		value: function handleSubmit(e) {
			console.log(e.target.action);

			fetch(e.target.action).then(function (r) {
				return console.log(r);
			});
			e.preventDefault();
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'form',
				{ action: 'http://ptt.client?step=ptt-save', method: 'post', onSubmit: this.handleSubmit },
				_react2.default.createElement(
					'div',
					{ className: 'hidden-fields' },
					_react2.default.createElement('input', { type: 'hidden', name: 'ptt-id', value: '' })
				),
				_react2.default.createElement(
					'div',
					null,
					_react2.default.createElement('input', { type: 'text', name: 'ptt[title]' })
				),
				_react2.default.createElement(
					'div',
					null,
					_react2.default.createElement('textarea', { name: 'ptt[content]' })
				),
				_react2.default.createElement(
					'div',
					null,
					_react2.default.createElement('input', { type: 'date', name: 'ptt[date]' })
				),
				_react2.default.createElement(
					'div',
					null,
					_react2.default.createElement('input', { type: 'number', name: 'ptt[pwptt_hours]', min: '0', step: '0.25', placeholder: '1.75' })
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

var LoadTimers = function (_React$Component3) {
	_inherits(LoadTimers, _React$Component3);

	function LoadTimers(props) {
		_classCallCheck(this, LoadTimers);

		var _this4 = _possibleConstructorReturn(this, (LoadTimers.__proto__ || Object.getPrototypeOf(LoadTimers)).call(this, props));

		_this4.state = {
			title: 'Loading...',
			query: {
				posts: [],
				taxonomies: {}
			}
		};

		_this4.handleClick = _this4.handleClick.bind(_this4);
		return _this4;
	}

	_createClass(LoadTimers, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this5 = this;

			var ptt = getPTT();

			console.log('begin fecth..');

			var _this = this;
			fetch(ptt.url).then(function (r) {
				// this is a promise. Set state once pormise has settled
				r.json().then(function (json) {
					console.log(json);
					_this5.setState({ title: 'Loaded', query: json });
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

	return LoadTimers;
}(_react2.default.Component);

// output the dashboard


_reactDom2.default.render(_react2.default.createElement(NewTimerBtn, null), document.getElementById('dashboard'));

// output posts
_reactDom2.default.render(_react2.default.createElement(LoadTimers, null), document.getElementById('root'));

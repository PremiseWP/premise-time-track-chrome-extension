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

// get the stored object in JSON format along with the url for client
var PTT = function (_React$Component) {
	_inherits(PTT, _React$Component);

	function PTT(props) {
		_classCallCheck(this, PTT);

		var _this2 = _possibleConstructorReturn(this, (PTT.__proto__ || Object.getPrototypeOf(PTT)).call(this, props));

		_this2.state = {
			ptt: _this2.getStored(),
			url: ''
		};
		return _this2;
	}

	_createClass(PTT, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			fetch(this.buildUrl()).then(function (r) {
				return r.text().then(function (t) {
					return console.log(t);
				});
			});
		}
	}, {
		key: 'render',
		value: function render() {
			var text = 'Stored Object is empty.';
			if (Object.keys(this.state.ptt).length > 0) {
				text = 'Stored Object is NOT empty.';
			}

			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'p',
					null,
					text
				),
				_react2.default.createElement(
					'p',
					null,
					'Soterd Object: ',
					JSON.stringify(this.state.ptt)
				),
				_react2.default.createElement(
					'p',
					null,
					'URL: ',
					this.state.url
				)
			);
		}
	}, {
		key: 'getStored',
		value: function getStored() {
			if (localStorage.getItem('ptt')) {
				// Get!
				return JSON.parse(localStorage.getItem('ptt'));
			} else {
				// New!
				return {};
			}
		}
	}, {
		key: 'setStored',
		value: function setStored(object) {
			localStorage.setItem('ptt', JSON.stringify(object));
		}
	}, {
		key: 'buildUrl',
		value: function buildUrl() {
			// if ( Object.keys( this.state.ptt ).length > 1 ) {
			/*const url = 'http://ptt.client';
   url + '?site_base='         + encodeURIComponent( ptt.site_base ) +
   		'&client_key='        + encodeURIComponent( ptt.client_key ) +
   		'&client_secret='     + encodeURIComponent( ptt.client_secret ) +
   		'&token_credentials=' + encodeURIComponent( ptt.token_credentials );*/
			var url = 'http://ptt.client?step=ptt-details' + '&site_base=' + encodeURIComponent('http://time.vallgroup.com/wp-json/') + '&client_key=' + encodeURIComponent('zyzSVcThUzvr') + '&client_secret=' + encodeURIComponent('kvdxdEEZjIsJfM6fZOHhbC0etrPBVXvotfoh0JiCzBCHhgSN') + '&token_credentials=' + encodeURIComponent('O:49:"League\OAuth1\Client\Credentials\TokenCredentials":2:{s:13:"*identifier";s:24:"oAXrp4Rzhie5wrwzVEQs2W0Q";s:9:"*secret";s:48:"e0L1WqHiGZSWhalqVFK1AENtYqxc8hYEVHvpuXrB8z56msWO";}');
			// ?site_base=http%3A%2F%2Flocalhost%2Ftest%2Fpremisesplitview%2F&client_key=I9aT2lBzYE2n&client_secret=0WwKpqHwgoVOgwwI7HgyjdAItd4DLZd8wEIQ2R6eRp0Lvqd8&token_credentials=O%3A49%3A%22League%5COAuth1%5CClient%5CCredentials%5CTokenCredentials%22%3A2%3A%7Bs%3A13%3A%22%00%2A%00identifier%22%3Bs%3A24%3A%229xMnHuPSmJrLKaWlyEDBytRu%22%3Bs%3A9%3A%22%00%2A%00secret%22%3Bs%3A48%3A%22z66bCzlBQX9smdjsx3ROS89ltMq7UZaej6YJ56dC3FmiZDbg%22%3B%7D
			return url; //this.setState({url: url});
			// }
		}
	}]);

	return PTT;
}(_react2.default.Component);

;

/**
 * New timer button
 *
 * Dsiplays the new timer button and handles click event
 */

var NewTimerBtn = function (_React$Component2) {
	_inherits(NewTimerBtn, _React$Component2);

	function NewTimerBtn(props) {
		_classCallCheck(this, NewTimerBtn);

		var _this3 = _possibleConstructorReturn(this, (NewTimerBtn.__proto__ || Object.getPrototypeOf(NewTimerBtn)).call(this, props));

		_this3.state = { text: 'New Timer' };

		_this3.handleClick = _this3.handleClick.bind(_this3);
		return _this3;
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


var NewTimerForm = function (_React$Component3) {
	_inherits(NewTimerForm, _React$Component3);

	function NewTimerForm(props) {
		_classCallCheck(this, NewTimerForm);

		var _this4 = _possibleConstructorReturn(this, (NewTimerForm.__proto__ || Object.getPrototypeOf(NewTimerForm)).call(this, props));

		_this4.state = {};

		_this4.handleSubmit = _this4.handleSubmit.bind(_this4);
		return _this4;
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

var LoadTimers = function (_React$Component4) {
	_inherits(LoadTimers, _React$Component4);

	function LoadTimers(props) {
		_classCallCheck(this, LoadTimers);

		var _this5 = _possibleConstructorReturn(this, (LoadTimers.__proto__ || Object.getPrototypeOf(LoadTimers)).call(this, props));

		_this5.state = {
			title: 'Loading...',
			query: {
				posts: [],
				taxonomies: {}
			}
		};

		_this5.handleClick = _this5.handleClick.bind(_this5);
		return _this5;
	}

	_createClass(LoadTimers, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this6 = this;

			console.log(ptt);

			var _this = this;
			fetch(ptt.url).then(function (r) {
				// this is a promise. Set state once pormise has settled
				r.json().then(function (json) {
					console.log(json);
					_this6.setState({ title: 'Loaded', query: json });
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
// ReactDOM.render(
// 	<NewTimerBtn />,
// 	document.getElementById('dashboard')
// );

// output posts


_reactDom2.default.render(_react2.default.createElement(PTT, null), document.getElementById('root'));

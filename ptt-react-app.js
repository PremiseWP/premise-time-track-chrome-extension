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

var DiscoverSite = function (_React$Component) {
	_inherits(DiscoverSite, _React$Component);

	function DiscoverSite(props) {
		_classCallCheck(this, DiscoverSite);

		var _this2 = _possibleConstructorReturn(this, (DiscoverSite.__proto__ || Object.getPrototypeOf(DiscoverSite)).call(this, props));

		_this2.state = {
			onSubmit: props.onSubmit
		};
		return _this2;
	}

	_createClass(DiscoverSite, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'form',
					{ onSubmit: this.state.onSubmit },
					_react2.default.createElement('input', { type: 'hidden', value: 'discover', name: 'step', id: 'step' }),
					_react2.default.createElement('input', { type: 'url', name: 'uri', id: 'uri', defaultValue: 'http://time.vallgroup.com' }),
					_react2.default.createElement('br', null),
					_react2.default.createElement('input', { type: 'submit' })
				)
			);
		}
	}]);

	return DiscoverSite;
}(_react2.default.Component);

var DiscoverCredentials = function (_React$Component2) {
	_inherits(DiscoverCredentials, _React$Component2);

	function DiscoverCredentials(props) {
		_classCallCheck(this, DiscoverCredentials);

		var _this3 = _possibleConstructorReturn(this, (DiscoverCredentials.__proto__ || Object.getPrototypeOf(DiscoverCredentials)).call(this, props));

		_this3.state = {
			onSubmit: props.onSubmit,
			siteBase: props.siteBase,
			siteAuthUrls: props.siteAuthUrls
		};
		return _this3;
	}

	_createClass(DiscoverCredentials, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'form',
					{ action: 'http://ptt.client', method: 'GET', onSubmit: this.state.onSubmit },
					_react2.default.createElement('input', { type: 'hidden', value: 'preauth', name: 'step', id: 'step' }),
					_react2.default.createElement('input', { type: 'hidden', value: this.state.siteBase, name: 'site_base', id: 'site_base' }),
					_react2.default.createElement('input', { type: 'hidden', value: JSON.stringify(this.state.siteAuthUrls), name: 'site_auth_urls', id: 'site_auth_urls' }),
					_react2.default.createElement('input', { type: 'hidden', value: window.location, name: 'site_referrer', id: 'site_referrer' }),
					_react2.default.createElement('input', { type: 'text', name: 'client_key', id: 'key', defaultValue: 'zyzSVcThUzvr' }),
					_react2.default.createElement('br', null),
					_react2.default.createElement('input', { type: 'text', name: 'client_secret', id: 'secret', defaultValue: 'kvdxdEEZjIsJfM6fZOHhbC0etrPBVXvotfoh0JiCzBCHhgSN' }),
					_react2.default.createElement('input', { type: 'submit' })
				)
			);
		}
	}]);

	return DiscoverCredentials;
}(_react2.default.Component);

/**
 * Get stored object
 */


var Discover = function (_React$Component3) {
	_inherits(Discover, _React$Component3);

	function Discover(props) {
		_classCallCheck(this, Discover);

		// { site: {}, oAuth: {}, url: '' }
		var _this4 = _possibleConstructorReturn(this, (Discover.__proto__ || Object.getPrototypeOf(Discover)).call(this, props));

		_this4.state = getStoredPtt();

		_this4.handleSubmit = _this4.handleSubmit.bind(_this4);
		return _this4;
	}

	_createClass(Discover, [{
		key: 'handleSubmit',
		value: function handleSubmit(e) {
			var _this5 = this;

			e.preventDefault();

			// get the data form the form
			var data = new FormData(e.target);

			// build the url based on the data passed by the form
			var _url = 'http://ptt.client?';
			// https://developer.mozilla.org/en-US/docs/Web/API/FormData/entries
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = data.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var pair = _step.value;

					_url += '&' + pair[0] + '=' + encodeURIComponent(pair[1]);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			console.log(_url);

			if ('discover' === data.get('step')) {
				// AJAX call the get credentials
				fetch(_url, {
					method: 'GET',
					mode: 'cors'
				}).then(function (r) {
					r.json().then(function (t) {
						_this5.setState({ site: t });
					});
				});
			} else {
				this.setState({ oAuth: {
						client_key: data.get('client_key'),
						client_secret: data.get('client_secret')
					} });
				window.open(_url, "Title", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=500, height=500, top=" + (screen.height / 2 - 250) + ", left=" + (screen.width / 2 - 250));
			}
		}
	}, {
		key: 'render',
		value: function render() {

			console.log('Discover State:');
			console.log(this.state);
			console.log('Stored PTT:');
			console.log(getStoredPtt());

			var fields = 'undefined' !== typeof this.state.site ? _react2.default.createElement(DiscoverCredentials, { siteBase: this.state.site.site_base, siteAuthUrls: this.state.site.site_auth_urls, onSubmit: this.handleSubmit }) : _react2.default.createElement(DiscoverSite, { onSubmit: this.handleSubmit });

			// before rendering save the PTT object
			setStoredPtt(this.state);

			return _react2.default.createElement(
				'div',
				null,
				fields
			);
		}
	}]);

	return Discover;
}(_react2.default.Component);

var Dashboard = function (_React$Component4) {
	_inherits(Dashboard, _React$Component4);

	function Dashboard(props) {
		_classCallCheck(this, Dashboard);

		return _possibleConstructorReturn(this, (Dashboard.__proto__ || Object.getPrototypeOf(Dashboard)).call(this, props));
	}

	_createClass(Dashboard, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				null,
				'Dashboard'
			);
		}
	}]);

	return Dashboard;
}(_react2.default.Component);

// get the stored object in JSON format along with the url for client


var PTT = function (_React$Component5) {
	_inherits(PTT, _React$Component5);

	function PTT(props) {
		_classCallCheck(this, PTT);

		var _this7 = _possibleConstructorReturn(this, (PTT.__proto__ || Object.getPrototypeOf(PTT)).call(this, props));

		_this7.state = {
			ptt: getStoredPtt(),
			url: ''
		};
		return _this7;
	}

	_createClass(PTT, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var view = !Object.keys(this.state.ptt).length > 0 ? _react2.default.createElement(Discover, null) : _react2.default.createElement(Dashboard, null);

			_reactDom2.default.render(_react2.default.createElement(Discover, null), document.getElementById('app'));
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				null,
				'PTT Loaded'
			);
		}
	}]);

	return PTT;
}(_react2.default.Component);

;
// Init
_reactDom2.default.render(_react2.default.createElement(PTT, null), document.getElementById('root'));

/*
	Helpers
 */

function getStoredPtt() {
	if (localStorage.getItem('ptt')) {
		// Get!
		return JSON.parse(localStorage.getItem('ptt'));
	} else {
		// New!
		return {};
	}
}

function setStoredPtt(object) {
	localStorage.setItem('ptt', JSON.stringify(object));
}

/**
 * New timer button
 *
 * Dsiplays the new timer button and handles click event
 */

var NewTimerBtn = function (_React$Component6) {
	_inherits(NewTimerBtn, _React$Component6);

	function NewTimerBtn(props) {
		_classCallCheck(this, NewTimerBtn);

		var _this8 = _possibleConstructorReturn(this, (NewTimerBtn.__proto__ || Object.getPrototypeOf(NewTimerBtn)).call(this, props));

		_this8.state = { text: 'New Timer' };

		_this8.handleClick = _this8.handleClick.bind(_this8);
		return _this8;
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


var NewTimerForm = function (_React$Component7) {
	_inherits(NewTimerForm, _React$Component7);

	function NewTimerForm(props) {
		_classCallCheck(this, NewTimerForm);

		var _this9 = _possibleConstructorReturn(this, (NewTimerForm.__proto__ || Object.getPrototypeOf(NewTimerForm)).call(this, props));

		_this9.state = {};

		_this9.handleSubmit = _this9.handleSubmit.bind(_this9);
		return _this9;
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

var LoadTimers = function (_React$Component8) {
	_inherits(LoadTimers, _React$Component8);

	function LoadTimers(props) {
		_classCallCheck(this, LoadTimers);

		var _this10 = _possibleConstructorReturn(this, (LoadTimers.__proto__ || Object.getPrototypeOf(LoadTimers)).call(this, props));

		_this10.state = {
			title: 'Loading...',
			query: {
				posts: [],
				taxonomies: {}
			}
		};

		_this10.handleClick = _this10.handleClick.bind(_this10);
		return _this10;
	}

	_createClass(LoadTimers, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this11 = this;

			console.log(ptt);

			var _this = this;
			fetch(ptt.url).then(function (r) {
				// this is a promise. Set state once pormise has settled
				r.json().then(function (json) {
					console.log(json);
					_this11.setState({ title: 'Loaded', query: json });
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

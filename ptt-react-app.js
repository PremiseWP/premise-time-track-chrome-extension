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
 * Authenticates our user and saves the site
 * info as a cookie in our browser.
 *
 * @param  {Object} creds the credentials to authenticate user
 * @return {void}
 */
function discoverSite(creds) {
	creds = creds || null;

	if (!creds) {
		console.error('No URL supplied to discover site.');
		return false;
	}

	fetch(creds.url + '/wp-json/').then(function (r) {
		r.json().then(function (s) {
			// save the site info
			PTT.site = s;

			// save the
			PTT.auth = wpApiAuth({
				oauth_consumer_key: creds.key,
				oauth_secret: creds.secret,
				url: creds.api_url,
				urls: s.authentication.oauth1
			});

			PTT.auth.authenticate(function (err, oauth) {
				var view;
				// handle errors first
				if (err) {
					view = _react2.default.createElement(Discover, { message: err.responseText });
				}
				// No errors! sho the dashboard
				else {
						view = _react2.default.createElement(Dashboard, null);
						Cookies.set('_ptt', creds);
					}

				_reactDom2.default.render(view, document.getElementById('app'));
			});
		});
	});
}

/**
 * Display a loading icon
 */

var LoadingIcon = function (_React$Component) {
	_inherits(LoadingIcon, _React$Component);

	function LoadingIcon(props) {
		_classCallCheck(this, LoadingIcon);

		var _this = _possibleConstructorReturn(this, (LoadingIcon.__proto__ || Object.getPrototypeOf(LoadingIcon)).call(this, props));

		_this.state = {
			size: '3em',
			icon: 'fa-spinner',
			align: 'center'
		};
		return _this;
	}

	_createClass(LoadingIcon, [{
		key: 'render',
		value: function render() {
			var divStyle = {
				textAlign: this.state.align
			};

			var iconStyle = {
				fontSize: this.state.size
			};

			return _react2.default.createElement(
				'div',
				{ className: 'loading_icon', style: divStyle },
				_react2.default.createElement('i', { className: 'fa fa-spin ' + this.state.icon,
					style: iconStyle })
			);
		}
	}]);

	return LoadingIcon;
}(_react2.default.Component);

/**
 * Output a dashboard box - in bet does not work when updatin state
 */


var DashboardBox = function (_React$Component2) {
	_inherits(DashboardBox, _React$Component2);

	function DashboardBox(props) {
		_classCallCheck(this, DashboardBox);

		var _this2 = _possibleConstructorReturn(this, (DashboardBox.__proto__ || Object.getPrototypeOf(DashboardBox)).call(this, props));

		_this2.state = {
			title: props.title || '',
			classes: props.classes || '',
			content: props.children || ''
		};

		_this2.toggleBoxContent = _this2.toggleBoxContent.bind(_this2);
		return _this2;
	}

	// toggle box content


	_createClass(DashboardBox, [{
		key: 'toggleBoxContent',
		value: function toggleBoxContent(e) {
			e.preventDefault();
			$(e.target).parents('.dashboard_box').find('.dashboard_box_content').slideToggle('fast');
			return false;
		}
	}, {
		key: 'render',
		value: function render() {
			console.log(this.state.content);
			return _react2.default.createElement(
				'div',
				{ id: this.state.title.toLowerCase(),
					className: 'dashboard_box' + this.state.classes },
				_react2.default.createElement(
					'div',
					{ className: 'dashboard_box_header' },
					_react2.default.createElement(
						'a',
						{ href: '#',
							className: 'dashboard_close_box',
							onClick: this.toggleBoxContent },
						_react2.default.createElement('i', { className: 'fa fa-caret-up' })
					),
					_react2.default.createElement(
						'h3',
						null,
						this.state.title
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'dashboard_box_content' },
					this.state.content
				)
			);
		}
	}]);

	return DashboardBox;
}(_react2.default.Component);
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PTT = {
	creds: Cookies.getJSON('_ptt')
};

window.ptt = PTT;

_reactDom2.default.render(_react2.default.createElement(LoadingIcon, null), document.getElementById('app'));

// Load our app when document is ready
$(document).ready(function () {

	if (PTT.creds) {
		discoverSite(PTT.creds);
	} else {
		_reactDom2.default.render(_react2.default.createElement(Discover, null), document.getElementById('app'));
	}
});
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
 * Display the dashboard
 */
var Dashboard = function (_React$Component) {
	_inherits(Dashboard, _React$Component);

	function Dashboard(props) {
		_classCallCheck(this, Dashboard);

		var _this = _possibleConstructorReturn(this, (Dashboard.__proto__ || Object.getPrototypeOf(Dashboard)).call(this, props));

		_this.state = {
			site: PTT.site || {},
			taxonomies: [{
				slug: 'premise_time_tracker_client',
				title: 'Clients'
			}, {
				slug: 'premise_time_tracker_project',
				title: 'Projects'
			}]
		};
		return _this;
	}

	_createClass(Dashboard, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ id: 'dashboard' },
				_react2.default.createElement(
					'div',
					{ className: 'dashboard_header' },
					_react2.default.createElement(
						'h1',
						null,
						this.state.site.name
					),
					_react2.default.createElement(
						'span',
						null,
						this.state.site.description
					)
				),
				_react2.default.createElement(NewTimerForm, null),
				this.loadTaxonomies()
			);
		}

		/**
   * load taxonomies in dashboard boxes
   */

	}, {
		key: 'loadTaxonomies',
		value: function loadTaxonomies() {
			var taxs = [];
			for (var i = this.state.taxonomies.length - 1; i >= 0; i--) {
				taxs.push(_react2.default.createElement(LoadTaxonomy, {
					slug: this.state.taxonomies[i].slug,
					title: this.state.taxonomies[i].title,
					key: i }));
			}
			return taxs;
		}
	}]);

	return Dashboard;
}(_react2.default.Component);
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
 * Displays and handles the form to discover the site and get the user signed in.
 * When finished, it loads the dashboard.
 */
var Discover = function (_React$Component) {
	_inherits(Discover, _React$Component);

	function Discover(props) {
		_classCallCheck(this, Discover);

		var _this = _possibleConstructorReturn(this, (Discover.__proto__ || Object.getPrototypeOf(Discover)).call(this, props));

		_this.state = {
			message: props.message || 'Let\'s find your site and get you authenticated.',
			processing: false
		};

		_this.handleSubmit = _this.handleSubmit.bind(_this);
		return _this;
	}

	_createClass(Discover, [{
		key: 'handleSubmit',
		value: function handleSubmit(e) {
			e.preventDefault();

			// loading icon
			this.setState({ processing: true });

			// get the data form the form
			var data = new FormData(e.target);

			// bild our credentials object
			var creds = {
				url: data.get('site_url'),
				key: data.get('client_key'),
				secret: data.get('client_secret')
			};

			// discover the site
			discoverSite(creds);
		}
	}, {
		key: 'render',
		value: function render() {
			var view = this.state.processing ? _react2.default.createElement(LoadingIcon, null) : this.theForm();
			return _react2.default.createElement(
				'div',
				{ className: 'discover_module' },
				_react2.default.createElement(
					'div',
					{ className: 'header' },
					_react2.default.createElement(
						'h1',
						null,
						'Premise Time Tracker'
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'container' },
					_react2.default.createElement(
						'div',
						{ className: 'message' },
						_react2.default.createElement(
							'p',
							null,
							this.state.message
						)
					),
					view
				)
			);
		}

		// returns the form

	}, {
		key: 'theForm',
		value: function theForm() {
			return _react2.default.createElement(
				'div',
				{ className: 'discover_form' },
				_react2.default.createElement(
					'form',
					{ id: 'discover_form', onSubmit: this.handleSubmit },
					_react2.default.createElement(
						'div',
						null,
						_react2.default.createElement(
							'label',
							{ htmlFor: 'site_url' },
							'Site Url'
						),
						_react2.default.createElement('br', null),
						_react2.default.createElement('input', { type: 'url',
							name: 'site_url',
							id: 'site_url',
							defaultValue: 'http://time.vallgroup.com' })
					),
					_react2.default.createElement(
						'div',
						null,
						_react2.default.createElement(
							'label',
							{ htmlFor: 'client_key' },
							'Client Key'
						),
						_react2.default.createElement('br', null),
						_react2.default.createElement('input', { type: 'text',
							name: 'client_key',
							id: 'key',
							defaultValue: 'YOpAWSAJwIVz' })
					),
					_react2.default.createElement(
						'div',
						null,
						_react2.default.createElement(
							'label',
							{ htmlFor: 'client_secret' },
							'Client Secret'
						),
						_react2.default.createElement('br', null),
						_react2.default.createElement('input', { type: 'text',
							name: 'client_secret',
							id: 'secret',
							defaultValue: 'JZi4vlcL8vf2oDrtkYLmWCWb2NqHaP7Pm1r9mbdY8nGtlRyL' })
					),
					_react2.default.createElement(
						'div',
						{ className: 'primary_btn' },
						_react2.default.createElement('input', { type: 'submit' })
					)
				)
			);
		}
	}]);

	return Discover;
}(_react2.default.Component);
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
 * Display the new timer button
 */
var NewTimer = function (_React$Component) {
	_inherits(NewTimer, _React$Component);

	function NewTimer(props) {
		_classCallCheck(this, NewTimer);

		var _this = _possibleConstructorReturn(this, (NewTimer.__proto__ || Object.getPrototypeOf(NewTimer)).call(this, props));

		_this.handleClick = _this.handleClick.bind(_this);

		_this.state = {
			view: ''
		};

		return _this;
	}

	_createClass(NewTimer, [{
		key: 'handleClick',
		value: function handleClick(e) {
			e.preventDefault();

			this.setState({
				view: _react2.default.createElement(NewTimerForm, null)
			});
		}
	}, {
		key: 'render',
		value: function render() {
			if ('' == this.state.view) {
				this.state.view = _react2.default.createElement(
					'button',
					{ id: 'new_timer_btn', className: 'start_timer', onClick: this.handleClick, title: 'New Timer' },
					_react2.default.createElement('i', { className: 'fa fa-clock-o' })
				);
			}

			return _react2.default.createElement(
				'div',
				{ id: 'new_timer' },
				this.state.view
			);
		}
	}]);

	return NewTimer;
}(_react2.default.Component);

/**
 *
 */


var NewTimerForm = function (_React$Component2) {
	_inherits(NewTimerForm, _React$Component2);

	function NewTimerForm(props) {
		_classCallCheck(this, NewTimerForm);

		var _this2 = _possibleConstructorReturn(this, (NewTimerForm.__proto__ || Object.getPrototypeOf(NewTimerForm)).call(this, props));

		_this2.state = {
			formURL: PTT.site.url + '/wp-json/wp/v2/premise_time_tracker'
		};

		_this2.handleSubmit = _this2.handleSubmit.bind(_this2);
		return _this2;
	}

	_createClass(NewTimerForm, [{
		key: 'handleSubmit',
		value: function handleSubmit(e) {
			e.preventDefault();

			var _form = e.target,
			    fields = $(_form).serializeArray(),
			    url = _form.action,
			    parser = '',
			    query;

			console.log(fields);
			// build query
			for (var i = fields.length - 1; i >= 0; i--) {
				if (fields[i].value.length) {
					parser += '&' + fields[i].name + '=' + fields[i].value;
				}
			}
			query = url + '?' + parser.substr(1, parser.length);
			console.log(query);
			$.ajax({
				beforeSend: PTT.auth.ajaxBeforeSend,
				method: 'POST',
				url: query
			}).done(function (response) {
				console.log(response);
			});
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ className: 'dashboard_box new_timer_form' },
				_react2.default.createElement(
					'div',
					{ className: 'dashboard_box_header' },
					_react2.default.createElement(
						'h3',
						null,
						'New Timer'
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'dashboard_box_content' },
					_react2.default.createElement(
						'form',
						{ action: this.state.formURL,
							method: 'post',
							onSubmit: this.handleSubmit },
						_react2.default.createElement('input', { type: 'hidden',
							name: 'status',
							value: 'publish' }),
						_react2.default.createElement(
							'div',
							{ className: 'pwp-row not-responsive' },
							_react2.default.createElement(
								'div',
								{ className: 'col2 premise-field' },
								_react2.default.createElement(
									'label',
									{ htmlFor: 'title' },
									'Title'
								),
								_react2.default.createElement('br', null),
								_react2.default.createElement('input', { type: 'text', name: 'title', id: 'title' })
							),
							_react2.default.createElement(
								'div',
								{ className: 'col2 premise-field' },
								_react2.default.createElement(
									'label',
									{ htmlFor: 'pwptt_hours' },
									'Time'
								),
								_react2.default.createElement('br', null),
								_react2.default.createElement('input', { type: 'number', name: 'pwptt_hours', id: 'pwptt_hours' })
							),
							_react2.default.createElement(
								'div',
								{ className: 'span12 premise-field' },
								_react2.default.createElement(
									'label',
									{ htmlFor: 'content' },
									'Description'
								),
								_react2.default.createElement('br', null),
								_react2.default.createElement('textarea', { name: 'content', id: 'content' })
							)
						),
						_react2.default.createElement(
							'div',
							{ className: 'primary_btn pwp-align-center' },
							_react2.default.createElement('input', { className: 'pwp-display-block', type: 'submit' })
						)
					)
				)
			);
		}
	}]);

	return NewTimerForm;
}(_react2.default.Component);
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
 * Load a taxonomy in the dashboard.
 */
var LoadTaxonomy = function (_React$Component) {
	_inherits(LoadTaxonomy, _React$Component);

	function LoadTaxonomy(props) {
		_classCallCheck(this, LoadTaxonomy);

		var _this = _possibleConstructorReturn(this, (LoadTaxonomy.__proto__ || Object.getPrototypeOf(LoadTaxonomy)).call(this, props));

		_this.state = {
			posts: [],
			view: _react2.default.createElement(LoadingIcon, null),
			title: props.title || '',
			slug: props.slug || '',
			taxURL: PTT.site.url + '/wp-json/wp/v2/' + props.slug + '/' };

		_this.loadTaxonomy = _this.loadTaxonomy.bind(_this);
		_this.closeTaxonomy = _this.closeTaxonomy.bind(_this);
		_this.toggleBoxContent = _this.toggleBoxContent.bind(_this);
		return _this;
	}

	// show the project module


	_createClass(LoadTaxonomy, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ id: this.state.title.toLowerCase(), className: 'dashboard_box' },
				_react2.default.createElement(
					'div',
					{ className: 'dashboard_box_header' },
					_react2.default.createElement(
						'a',
						{ href: '#', className: 'dashboard_close_box', onClick: this.toggleBoxContent },
						_react2.default.createElement('i', { className: 'fa fa-caret-up' })
					),
					_react2.default.createElement(
						'h3',
						null,
						this.state.title
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'dashboard_box_content' },
					this.state.view
				)
			);
		}

		// Once loaded, ajax for projects

	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			// get projects list
			fetch(this.state.taxURL).then(function (response) {
				response.json().then(function (_terms) {
					// prepare the list of projects
					var list = [];
					for (var i = _terms.length - 1; i >= 0; i--) {
						list.push(_react2.default.createElement(
							'li',
							{ className: 'tax_li', key: _terms[i].id },
							_react2.default.createElement(
								'a',
								{ href: '#',
									onClick: _this2.loadTaxonomy,
									'data-tax-id': _terms[i].id,
									'data-tax-name': _terms[i].name,
									'data-tax-count': _terms[i].count },
								_terms[i].name
							)
						));
					}
					// wrap the list before inserting it
					// and save it to our state object
					_this2.state.posts = _react2.default.createElement(
						'ul',
						{ className: 'taxonomy_list' },
						list
					);
					// update the UI
					_this2.setState({ view: _this2.state.posts });
				});
			});
		}

		// load a new project

	}, {
		key: 'loadTaxonomy',
		value: function loadTaxonomy(e) {
			var _this3 = this;

			e.preventDefault();

			this.setState({ view: _react2.default.createElement(LoadingIcon, null) });

			var _id = e.target.getAttribute('data-tax-id');

			fetch(window.PTT.site.url + '/wp-json/wp/v2/premise_time_tracker/?per_page=100&' + this.state.slug + '=' + _id).then(function (r) {
				r.json().then(function (timers) {

					var list = [];
					var total = '0.00';
					for (var i = timers.length - 1; i >= 0; i--) {
						list.push(_react2.default.createElement(
							'li',
							{ className: 'timer_li', key: timers[i].id },
							_react2.default.createElement(
								'span',
								{ className: 'time' },
								timers[i].pwptt_hours
							),
							_react2.default.createElement(
								'h2',
								null,
								timers[i].title.rendered
							),
							_react2.default.createElement('p', { className: 'description', dangerouslySetInnerHTML: { __html: timers[i].content.rendered } })
						));
						total = +total + +timers[i].pwptt_hours;
					}
					// wrap the list before inserting it
					// and save it to our state object
					var ul = _react2.default.createElement(
						'div',
						{ className: 'taxonomy_view' },
						_react2.default.createElement(
							'div',
							{ className: 'close_taxonomy' },
							_react2.default.createElement(
								'a',
								{ href: '#', onClick: _this3.closeTaxonomy },
								_react2.default.createElement('i', { className: 'fa fa-close' })
							)
						),
						_react2.default.createElement(
							'div',
							{ className: 'timers_loop' },
							_react2.default.createElement(
								'span',
								null,
								'Total: ',
								total
							),
							_react2.default.createElement(
								'ul',
								{ className: 'timers_list' },
								list
							),
							_react2.default.createElement(
								'span',
								null,
								'Total: ',
								total
							)
						)
					);
					// update the UI
					_this3.setState({ view: ul });
				});
			});
		}

		// close a project and show back the list

	}, {
		key: 'closeTaxonomy',
		value: function closeTaxonomy(e) {
			e.preventDefault();

			this.setState({ view: this.state.posts });
		}

		// toggle box content

	}, {
		key: 'toggleBoxContent',
		value: function toggleBoxContent(e) {
			e.preventDefault();
			$(e.target).parents('.dashboard_box').find('.dashboard_box_content').slideToggle('fast');
			return false;
		}
	}]);

	return LoadTaxonomy;
}(_react2.default.Component);

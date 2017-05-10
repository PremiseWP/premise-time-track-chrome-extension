import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Load a taxonomy in the dashboard.
 */
class LoadTaxonomy extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			posts:  [],
			view:   <LoadingIcon />,
			title: props.title || '',
			slug: props.slug || '',
			taxURL: PTT.site.url + '/wp-json/wp/v2/' + props.slug + '/', // 'premise_time_tracker_project',
		};

		this.loadTaxonomy     = this.loadTaxonomy.bind(this);
		this.closeTaxonomy    = this.closeTaxonomy.bind(this);
		this.toggleBoxContent = this.toggleBoxContent.bind(this);
	}

	// show the project module
	render() {
		return (
			<div id={this.state.title.toLowerCase()} className="dashboard_box">
				<div className="dashboard_box_header">
					<a href="#" className="dashboard_close_box" onClick={this.toggleBoxContent}>
						<i className="fa fa-caret-up" />
					</a>
				 	<h3>{this.state.title}</h3>
				 </div>
			 	<div className="dashboard_box_content">
					{this.state.view}
				</div>
			</div>
		);
	}

	// Once loaded, ajax for projects
	componentDidMount() {
		// get projects list
		fetch( this.state.taxURL )
		.then( response => {
			response.json().then( _terms => {
				// prepare the list of projects
				let list = [];
				for ( var i = _terms.length - 1; i >= 0; i-- ) {
					list.push(
						<li className="tax_li" key={_terms[i].id}>
							<a href="#"
								onClick={this.loadTaxonomy}
								data-tax-id={_terms[i].id}
								data-tax-name={_terms[i].name}
								data-tax-count={_terms[i].count}>
								{_terms[i].name}
							</a>
						</li>
					);
				}
				// wrap the list before inserting it
				// and save it to our state object
				this.state.posts = <ul className="taxonomy_list">
					{list}
				</ul>;
				// update the UI
				this.setState( {view: this.state.posts } );
			});
		});
	}

	// load a new project
	loadTaxonomy(e) {
		e.preventDefault();

		this.setState( {view: <LoadingIcon /> } );

		const _id = e.target.getAttribute( 'data-tax-id' );

		fetch( PTT.site.url + '/wp-json/wp/v2/premise_time_tracker/?per_page=100&' + this.state.slug + '=' + _id )
		.then( r => {
			r.json().then( timers => {

				let list = [];
				let total = '0.00';
				for ( var i = timers.length - 1; i >= 0; i-- ) {
					list.push(
						<li className="timer_li" key={timers[i].id}>
							<span className="time">{timers[i].pwptt_hours}</span>
							<h2>{timers[i].title.rendered}</h2>
							<p className="description" dangerouslySetInnerHTML={{ __html: timers[i].content.rendered }} />
						</li>
					);
					total = +total + +timers[i].pwptt_hours;
				}
				// wrap the list before inserting it
				// and save it to our state object
				const ul = <div className="taxonomy_view">
					<div className="close_taxonomy">
						<a href="#" onClick={this.closeTaxonomy}><i className="fa fa-close" /></a>
					</div>
					<div className="timers_loop">
						<span>Total: {total}</span>
						<ul className="timers_list">
							{list}
						</ul>
						<span>Total: {total}</span>
					</div>
				</div>;
				// update the UI
				this.setState( {view: ul } );
			} );
		} );
	}

	// close a project and show back the list
	closeTaxonomy(e) {
		e.preventDefault();

		this.setState( {view: this.state.posts } );
	}

	// toggle box content
	toggleBoxContent(e) {
		e.preventDefault();
		$(e.target).parents( '.dashboard_box' ).find( '.dashboard_box_content' ).slideToggle( 'fast' );
		return false;
	}
}
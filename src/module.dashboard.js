import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Display the dashboard
 */
class Dashboard extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			site: PTT.site || {},
			taxonomies: [{
				slug:  'premise_time_tracker_client',
				title: 'Clients',
			},
			{
				slug:  'premise_time_tracker_project',
				title: 'Projects',
			}]
		};
	}

	render() {
		return (
			<div id="dashboard">

				<div className="dashboard_header">
					<h1>{this.state.site.name}</h1>
					<span>{this.state.site.description}</span>
				</div>

				<NewTimer />

				{/*this.loadTaxonomies()*/}

			</div>
		);
	}

	/**
	 * load taxonomies in dashboard boxes
	 */
	loadTaxonomies() {
		let taxs = [];
		for (var i = this.state.taxonomies.length - 1; i >= 0; i--) {
			taxs.push(
				<LoadTaxonomy
					slug={this.state.taxonomies[i].slug}
					title={this.state.taxonomies[i].title}
					key={i} />
			);
		}
		return taxs;
	}
}
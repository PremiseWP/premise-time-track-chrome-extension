# Premise Time Track Chrome extension

Chrome extension for the [Premise Time Tracker](https://github.com/PremiseWP/premise-time-track/) Wordpress plugin.

Relies on the [Premise Time Track REST Client](https://github.com/PremiseWP/premise-time-track-rest-client).

This Chrome extension is mainly a wrapper for the client (called inside an iframe). The Oauth credentials are saved in LocalStorage.

## Setup

Edit the `phpClientUrl` variable in the `premise-time-track.js` file.

Add permissions for both the client URL and the Wordpress site to the `manifest.json` file.

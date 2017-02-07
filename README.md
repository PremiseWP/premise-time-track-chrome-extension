# Premise Time Track Chrome extension

Chrome extension for the [Premise Time Tracker](https://github.com/PremiseWP/premise-time-track/) Wordpress plugin.

Relies on the [Premise Time Track REST Client](https://github.com/PremiseWP/premise-time-track-rest-client).

This Chrome extension is mainly a wrapper for the client (called inside an iframe). The Oauth credentials are saved in LocalStorage.

## Setup

Edit the `phpClientUrl` variable in the `premise-time-track.js` file.


### 400 No Oauth parameters supplied error

If you experience a "400 No Oauth parameters supplied error", this may be due to the Authorization header blocked.
Edit your **Wordpress** `.htaccess` file this way:

```
# REST API fix 400 error.
# RewriteRule ^index\.php$ - [L]
RewriteRule ^index\.php$ - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization},L]
```


### New client / project / timesheet not appearing in the list

When creating a new Timer and adding a new client / project / timesheet, it may not be displayed right away.
If you experience this issue, please check your Wordpress installation for _cache plugins_ and deactivate them.

Lizard-Tile-Dashboard
=====================

This is the React/Redux-based dashboard web-app, useable by each Lizard portal.


Installation
============

- Required: A working nodejs and yarn installation.
- In the root directory of the repository: `$ yarn install`
- (temporarily, until release) `$ npm link lizard-api-client`, see [lizard-api-client](https://github.com/nens/lizard-api-client)
- ...followed by `$ PROXY_USERNAME=<your_sso_username> PROXY_PASSWORD=<your_sso_password> yarn start`


create-react-app
================

The base skeleton for this project was generated using [create-react-app](https://github.com/facebookincubator/create-react-app).


Development
===========

A pre-commit hook is configured to run [Prettier.js](https://github.com/prettier/prettier) every time, so the codebase stays in consistent form, style-wise.

If you work on this project, please submit changes via Pull Requests and follow the [commit guidelines as outlined here](https://github.com/conventional-changelog/standard-version#commit-message-convention-at-a-glance).

See [![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)

These commit messages will be used to auto-generate `CHANGELOG.md`.

Have a look at the [buck-trap README](https://github.com/nens/buck-trap/blob/master/README.md) for more information about the release procedure.


Production bundle
=================

Run `yarn build` and look in the `build/` folder.


Releasing
=========

To be written...


Deployment
==========

Uses Ansible for deployment.

Ansible requires:

- the file `deploy/hosts` which can be created from `deploy.hosts.example` by filling out the server names. But it is best is to ask a collegue for this file.
- the file `deploy/production_hosts` which can be created from `deploy/production_hosts.example` by filling out the server names. But it is best is to ask a collegue for this file.
- the file `deploy/group_vars/all` which can be created from `deploy/group_vars/all.example` by filling each line with the correct value. But best is to ask a collegue for this file.

Ansible requires you to set a public ssh key on the remote server. Run the following command to send your public key to the server:

```sh
ssh-copy-id <USERNAME>@<SERVER_NAME>
```

Now deploy for staging:

```sh
npm run staging-deploy
```

Or deploy for production:

```sh
npm run production-deploy
```


_NOTE: When ansible complains about permissions this may be because the owners for some files were changed to `root`, where this should be `buildout`. In this case use ssh to connect to the server and navigate to the folder of the deployment path. Then change the owner of the `dist/` folder to buildout: ```chown -R buildout:buildout /dist```._




Internationalisation
====================

This client has l10n/i18n support via react-intl.
English is the default/fallback language.

To extract translation tags to the i18n catalog: `$ yarn run i18n:extract`.
To update the language catalogs: `$ yarn run i18n:update`

To execute both subsequently, run: `$ yarn run i18n:extract-then-update`.

See `src/translations/locales/[language].json`. (where language is 'nl', for now)

Adding a portal-specific logo
=============================

1) The _advisor_ selects the logo he wants (```.png``` or ```.jp(e)g```, e.g. ```lutjebroek.png```), and scales it in a way that the height becomes **exactly 72px**. This scaling is required to keep the dashboard looking good.
2) The _advisor_ sends a coder the scaled image via email.
3) The _advisor_ can already update the client-configuration for this dashboard instance:
```
{
    ...
    "meta": {
        ...
        "logo": "logos/lutjebroek.png",
        ...
    }
    ...
}
```

**NB!** Mind the omission of the leading slash: _logos/lutjebroek.png_ a.o.t. _/logos/lutjebroek.png_"

4) The _coder_ moves the received image into the following folder: https://github.com/nens/lizard-tile-dashboard/tree/master/public/logos/
5) Now, the logo will be read correctly from the client-config, both while developing and in production/staging environment


Redux
=====

Uses lizard-api-client for XHR calls to the back-end and returns Immutable.js datastructures.
See actions.js and reducers.js.


React-router
============

There are two routes:

- "/" - renders the grid layout
- "/full/:id" - renders the detail page of a tile


Sentry
======

To be written...


Browser development extensions
==============================

These extensions may help:

- React Devtools for [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

- Redux Devtools for [Chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) or [Firefox](https://addons.mozilla.org/en-Gb/firefox/addon/remotedev/)

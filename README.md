Lizard-Tile-Dashboard
=====================

This is the React/Redux-based dashboard web-app, useable by each Lizard portal.

Client Configuration
====================

This product is designed to be configurable for different customers, by configuring the json fields in the "client_configuration" table.
For more information on how to configure the tile dashboards visit [the configuration README](./configuration/clientConfiguration.rst)


Installation
============

- Required: A working nodejs and yarn installation.
- `$ yarn install`
- copy the file `startauth.sh.example` and rename it `startauth.sh`
- In the newly created file `startauth.sh` fill out the values for the api keys:   
    Replace `123456789STAGINGKEY` with a key created with [api-key-management-page](https://nxt3.staging.lizard.net/management/#/personal_api_keys).  
    Replace `123456789PRODKEY` with a key created with [production_api-key-management-page](https://demo.lizard.net/management/#/personal_api_keys). 
- In the newly created file `startauth.sh` make sure one and one line only is uncommented.  
(based on to which url you want to proxy) 
- Now run `yarn run startauth`


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

Run `GENERATE_SOURCEMAP=false yarn build` and look in the `dist/` folder.


Releasing
=========

To tag this as a new release and to add the `dist` folder to the release attachments we use nens/buck-trap. If you have not already done so, create a github token and add it to `deploy/auth.json`.

You can create your tokens here: https://github.com/settings/tokens
Grant the token full access under the repo section

The `auth.json` file should like similar to this:

```
{
    "token": "Your-token-that-you-created-on-github"
}
```

Release:

`$ yarn run release`

Buck-trap ups version number in `package.json`, compiles the `CHANGELOG.md` tags and creates a github release with a zipped `dist/`.

NOTE: Sometimes buck trap messes up for unknown reasons. It does everything except making the github release. It hangs with the message: `tag already exists`. This sucks because you will have to clean up the tag and revert the release commit.

NOTE on the NOTE: One time reverting the release commit an making a new release it did not update the CHANGELOG.md again which resulted in this PR: #821.


Deployment
==========

For the deployment of frontend repositories we make use of an Ansible script in the lizard-nxt repository.
More information is provided in the readme file of lizard-nxt: https://github.com/nens/lizard-nxt/blob/master/README.rst
Look below the heading "Deployment clients".


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



Security vulnerabilities
========================

We have lowered the amount of known security vulnerabilities to the following 75 (all low severity).
This app can not change any data (just read data), so the security threath is not high.
We therefore accept these for now.
Below summary is copy pasted from the terminal and can best be viewed in plain text (instead of markdown preview).

yarn audit v1.12.3
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ babel-jest                                                   │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ babel-jest > babel-plugin-istanbul > test-exclude >          │
│               │ micromatch > braces                                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-config > babel-jest >                 │
│               │ babel-plugin-istanbul > test-exclude > micromatch > braces   │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-config > babel-jest >   │
│               │ babel-plugin-istanbul > test-exclude > micromatch > braces   │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-runtime > jest-config > │
│               │ babel-jest > babel-plugin-istanbul > test-exclude >          │
│               │ micromatch > braces                                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runtime > jest-config > babel-jest >  │
│               │ babel-plugin-istanbul > test-exclude > micromatch > braces   │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-runtime >               │
│               │ babel-plugin-istanbul > test-exclude > micromatch > braces   │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runtime > babel-plugin-istanbul >     │
│               │ test-exclude > micromatch > braces                           │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-config > jest-environment-jsdom >     │
│               │ jest-util > jest-message-util > micromatch > braces          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-config >                │
│               │ jest-environment-jsdom > jest-util > jest-message-util >     │
│               │ micromatch > braces                                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-runtime > jest-config > │
│               │ jest-environment-jsdom > jest-util > jest-message-util >     │
│               │ micromatch > braces                                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runtime > jest-config >               │
│               │ jest-environment-jsdom > jest-util > jest-message-util >     │
│               │ micromatch > braces                                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-environment-jsdom > jest-util >       │
│               │ jest-message-util > micromatch > braces                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-config > jest-environment-node >      │
│               │ jest-util > jest-message-util > micromatch > braces          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-config >                │
│               │ jest-environment-node > jest-util > jest-message-util >      │
│               │ micromatch > braces                                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-runtime > jest-config > │
│               │ jest-environment-node > jest-util > jest-message-util >      │
│               │ micromatch > braces                                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runtime > jest-config >               │
│               │ jest-environment-node > jest-util > jest-message-util >      │
│               │ micromatch > braces                                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-config > jest-jasmine2 > jest-util >  │
│               │ jest-message-util > micromatch > braces                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-config > jest-jasmine2  │
│               │ > jest-util > jest-message-util > micromatch > braces        │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-runtime > jest-config > │
│               │ jest-jasmine2 > jest-util > jest-message-util > micromatch > │
│               │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runtime > jest-config > jest-jasmine2 │
│               │ > jest-util > jest-message-util > micromatch > braces        │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-jasmine2 > jest-util >  │
│               │ jest-message-util > micromatch > braces                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-config > jest-util >                  │
│               │ jest-message-util > micromatch > braces                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-config > jest-util >    │
│               │ jest-message-util > micromatch > braces                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-runtime > jest-config > │
│               │ jest-util > jest-message-util > micromatch > braces          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runtime > jest-config > jest-util >   │
│               │ jest-message-util > micromatch > braces                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-runtime > jest-util >   │
│               │ jest-message-util > micromatch > braces                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runtime > jest-util >                 │
│               │ jest-message-util > micromatch > braces                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-util >                  │
│               │ jest-message-util > micromatch > braces                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-util > jest-message-util > micromatch │
│               │ > braces                                                     │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-config > jest-jasmine2 > expect >     │
│               │ jest-message-util > micromatch > braces                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-config > jest-jasmine2  │
│               │ > expect > jest-message-util > micromatch > braces           │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-runtime > jest-config > │
│               │ jest-jasmine2 > expect > jest-message-util > micromatch >    │
│               │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runtime > jest-config > jest-jasmine2 │
│               │ > expect > jest-message-util > micromatch > braces           │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-jasmine2 > expect >     │
│               │ jest-message-util > micromatch > braces                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-config > jest-jasmine2 >              │
│               │ jest-message-util > micromatch > braces                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-config > jest-jasmine2  │
│               │ > jest-message-util > micromatch > braces                    │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-runtime > jest-config > │
│               │ jest-jasmine2 > jest-message-util > micromatch > braces      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runtime > jest-config > jest-jasmine2 │
│               │ > jest-message-util > micromatch > braces                    │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-jasmine2 >              │
│               │ jest-message-util > micromatch > braces                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-config > jest-jasmine2 >              │
│               │ jest-snapshot > jest-message-util > micromatch > braces      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-config > jest-jasmine2  │
│               │ > jest-snapshot > jest-message-util > micromatch > braces    │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-runtime > jest-config > │
│               │ jest-jasmine2 > jest-snapshot > jest-message-util >          │
│               │ micromatch > braces                                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runtime > jest-config > jest-jasmine2 │
│               │ > jest-snapshot > jest-message-util > micromatch > braces    │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-jasmine2 >              │
│               │ jest-snapshot > jest-message-util > micromatch > braces      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-resolve-dependencies > jest-snapshot  │
│               │ > jest-message-util > micromatch > braces                    │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-runtime > jest-snapshot │
│               │ > jest-message-util > micromatch > braces                    │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runtime > jest-snapshot >             │
│               │ jest-message-util > micromatch > braces                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-snapshot > jest-message-util >        │
│               │ micromatch > braces                                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-message-util > micromatch > braces    │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-message-util >          │
│               │ micromatch > braces                                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-runtime >               │
│               │ jest-message-util > micromatch > braces                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runtime > jest-message-util >         │
│               │ micromatch > braces                                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-config > micromatch > braces          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-config > micromatch >   │
│               │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-runtime > jest-config > │
│               │ micromatch > braces                                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runtime > jest-config > micromatch >  │
│               │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-haste-map > micromatch > braces       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-haste-map > micromatch  │
│               │ > braces                                                     │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-runtime >               │
│               │ jest-haste-map > micromatch > braces                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runtime > jest-haste-map > micromatch │
│               │ > braces                                                     │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-runtime > micromatch >  │
│               │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runtime > micromatch > braces         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > micromatch > braces                        │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/786                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Denial of Service                                            │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ mem                                                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=4.0.0                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-runtime > yargs >       │
│               │ os-locale > mem                                              │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/1084                      │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Denial of Service                                            │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ mem                                                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=4.0.0                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runtime > yargs > os-locale > mem     │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/1084                      │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Denial of Service                                            │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ mem                                                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=4.0.0                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > yargs > os-locale > mem                    │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/1084                      │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Prototype Pollution                                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ yargs-parser                                                 │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=13.1.2 <14.0.0 || >=15.0.1 <16.0.0 || >=18.1.2             │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runner > jest-runtime > yargs >       │
│               │ yargs-parser                                                 │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/1500                      │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Prototype Pollution                                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ yargs-parser                                                 │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=13.1.2 <14.0.0 || >=15.0.1 <16.0.0 || >=18.1.2             │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > jest-runtime > yargs > yargs-parser        │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/1500                      │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Prototype Pollution                                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ yargs-parser                                                 │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=13.1.2 <14.0.0 || >=15.0.1 <16.0.0 || >=18.1.2             │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest                                                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > yargs > yargs-parser                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/1500                      │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Prototype Pollution                                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ yargs-parser                                                 │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=13.1.2 <14.0.0 || >=15.0.1 <16.0.0 || >=18.1.2             │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ webpack-dev-server                                           │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ webpack-dev-server > yargs > yargs-parser                    │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/1500                      │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Prototype Pollution                                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ yargs-parser                                                 │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=13.1.2 <14.0.0 || >=15.0.1 <16.0.0 || >=18.1.2             │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ extract-react-intl-messages                                  │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ extract-react-intl-messages > meow > yargs-parser            │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/1500                      │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Prototype Pollution                                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ minimist                                                     │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=0.2.1 <1.0.0 || >=1.2.3                                    │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ @svgr/webpack                                                │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ @svgr/webpack > @svgr/plugin-svgo > svgo > mkdirp > minimist │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/1179                      │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Prototype Pollution                                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ minimist                                                     │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=0.2.1 <1.0.0 || >=1.2.3                                    │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ optimize-css-assets-webpack-plugin                           │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ optimize-css-assets-webpack-plugin > cssnano >               │
│               │ cssnano-preset-default > postcss-svgo > svgo > mkdirp >      │
│               │ minimist                                                     │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/1179                      │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Prototype Pollution                                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ minimist                                                     │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=0.2.1 <1.0.0 || >=1.2.3                                    │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ webpack                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ webpack > mkdirp > minimist                                  │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/1179                      │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Prototype Pollution                                          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ minimist                                                     │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=0.2.1 <1.0.0 || >=1.2.3                                    │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ eslint-loader                                                │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ eslint-loader > loader-fs-cache > mkdirp > minimist          │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/1179                      │
└───────────────┴──────────────────────────────────────────────────────────────┘
75 vulnerabilities found - Packages audited: 2502
Severity: 75 Low
Done in 2.57s.
➜  lizard-tile-dashboard git:(tom-security_vulnerability1)  
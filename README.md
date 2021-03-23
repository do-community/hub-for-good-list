# Hollie's Hub for Good projects list

A collection of projects making an impact with Hollie's Hub for Good.

---

## Development/Building

To setup the build/develop environment, you will need to run `npm i` with Node 12+ installed. This
 will install the dependencies to allow you to build the project.
 
To build or develop this tool, you will need to create a Google sheet to power the page and a Google
 API service account with access to that sheet. The id of this sheet and the details for the service
 can then be added to a `config.js` file at the root of the project, following the structure shown
 in `config.example.js`.

The scripts that use these details also support environment variables instead of the config file,
 see the information contained in the comments of `config.example.js` for what environment variables
 to set.

To develop for this tool run `npm run dev`.
This will start a development server that will automatically reload the codebase when changes occur.

If you wish to host this tool on a service, simply run `npm run build`. This will run all the
 necessary build scripts automatically to build the tool.\
You can then take the `dist` folder and put it on your web server/bucket.

GitHub Actions is setup to do this automatically for this repository to deploy to gh-pages.

## Source Structure

### [`src/hub-for-good-list`](./src/hub-for-good-list)

#### [`src/hub-for-good-list/i18n`](./src/hub-for-good-list/i18n)

In this directory lives all the internationalisation data and strings for the tool. Currently, this
 only contains the English versions of the strings but could be expanded in the future.

#### [`src/hub-for-good-list/scss`](./src/hub-for-good-list/scss)

The scss directory contains the main SCSS styling file for the tool, which imports our do-bulma
 library and then adds tool-specific customisations.

#### [`src/hub-for-good-list/templates`](./src/hub-for-good-list/templates)

This directory contains the Vue templates that are used to render the tool on the client-side.
 `app.vue` is the main Vue file, which other templates and libraries are loaded into.

### [`src/build`](./src/build)

The build directory contains a special utility script that is used during the initial build of the
 tool both for deployments and in development. This script uses the provided Google API details to
 fetch projects from the configured Google sheet, saving them to a JSON file that the tool can use.

## Contributing

If you are contributing, please read the [contributing file](CONTRIBUTING.md) before submitting your
 pull requests.

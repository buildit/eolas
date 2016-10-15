# eolas
Galic - Knowledge (of experience)

## PURPOSE

This project is a Nodejs / Expressjs based REST service primarily used to provide project related information to the Buildit Management Information Utilities (see Synapse as the reference client).  Additionally it allows for the creation and maintenance of structures that drive the extraction and transformation of said project related demand, defect, and effort data.

## INSTALLATION

Eolas requires the installation of NPM prior to doing any work.  [See the NPM site for installation instructions](npmjs.com "NPM installtion")

The Eolas service also requires a data store. At this time that is MongoDB.
Please install, configure, and have it running prior to using this app.  See MongoDB installation hints [here](mongodb.md "Mongo DB installtion instructions")

Once installed you can use the `datastore.dbUrl` property defined in the `config/development.json` file to point to your installation.

The `datastore.context` property defined in the `config/development.json` file is used to allow users / installs to share a common mongo instance and still maintain separate data.  Yes it is a bit of a hack, but it works.

Prior to using or developing run the command below to load all node.js requirements

```sh
$ npm install
```

## USAGE

### Serve data
To start the REST server:
```sh
$ npm start
```

Edit `config/development.json` to change the port on which the server listens.

## DEVELOPMENT

[For discussion on the structure of this project](structure.md "Eolas structure")

Eolas is uses ESLint recommended rules to guide code format styles.  Rules are defined in the .eslintrc file.  By default all .js files are linted.

Eolas uses Mocha and associated libraries to support unit level testing and nycjs to document code coverage.  Want to make a change?  Write a test.  Write code until it passes.  Make sure you didn't break any other tests.

Eolas uses a Mocha derivative called Chakram to support acceptance testing.  Acceptance testing requires a running instance of Eolas to execute against.  Want to make a change?  (you see where I am going with this).

The scripts below are defined in package.json and are excuted by the CI process.  Please exectute the validate and accept scripts prior to checking in code.

| cli                 | purpose                                                             |
|---------------------|---------------------------------------------------------------------|
| `npm run lint`      | Run ESLint on all project .js files                                 |
| `npm run security`  | Run node security check                                             |
| `npm run test`      | Run unit tests (mocha)                                              |
| `npm run validate`  | Run all of the above                                                |
| `npm run accept`    | Run acceptance tests (chakram) - requires the server to be running  |

Eolas also makes use of Gulp to support configuration and packaging.  See gulpfile.js

Eolas CI/CD assumes the use of Jenkins Pipeline features (as described by the staging and production groovy scripts in the pipelines directory).  CI/CD in turn relies on both Docker and Convox for packaging and deployment respectively.

## Swagger API
The Eolas REST API is documented using Swagger.  See the link below for directions on viewing and maintaining said documentation.

[Directions](swagger.md "Swagger documentation generation")

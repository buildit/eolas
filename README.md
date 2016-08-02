# eolas
Galic - Knowledge (of experience)

## PURPOSE

This project is an expressjs based REST service primarily used to provide project related information to the Buildit Management Information Utilities.  Additionally it allows for the creation and maintenance of structures that drive the extraction and transformation of said project related demand, defect, and effort data.

## INSTALLATION

This service requires a data store. At this time that is MongoDB.
Please install, configure, and have it running prior to using this app.
Then use the `config/development.json` to set the mongodb URL.

See installation hints [here](`mongodb.md`)

Prior to using or developing run the command below to load all node.js requirements

```sh
$ npm install
```

## USAGE

### Serve data

Below runs the REST server.

Edit `config/development.json` to change the port on which the server listens.

Resources supported are described in the `MI_JSON_MODEL.json` file

```sh
$ node index.js
```

This project uses log4js.  There is a config file that specifically for that.
It is handy to have console logging on when debugging so add the following into the appenders list.
```json
	{
		"type": "console",
		"layout": {
			"type": "pattern",
			"pattern": "%d{ABSOLUTE} %[%-5p%] %c %m"
		}
	}
```
## DEVELOPMENT

This project makes use of gulp.js as a build manager.

| cli                | purpose                                                             |
|--------------------|---------------------------------------------------------------------|
| `gulp lint`        | Run ESLint on all project .js files                                 |
| `gulp nsp`         | Run node security check                                             |
| `gulp test`        | Run unit tests (mocha)                                              |
| `gulp accept`      | Run acceptance tests (chakram) - requires the server to be running  |
| `gulp build`       | Run all of the above                                                |

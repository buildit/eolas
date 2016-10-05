# eolas
Galic - Knowledge (of experience)

## PURPOSE

This project is an expressjs based REST service primarily used to provide project related information to the Buildit Management Information Utilities.  Additionally it allows for the creation and maintenance of structures that drive the extraction and transformation of said project related demand, defect, and effort data.

## INSTALLATION

This service requires a data store. At this time that is MongoDB.
Please install, configure, and have it running prior to using this app.
Then use the `config/development.json` to set the mongodb URL.

See MongoDB installation hints [here](mongodb.md "Mongo DB installtion instructions")

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

Resources supported are described in the `MI_JSON_MODEL.json` file

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

| cli                 | purpose                                                             |
|---------------------|---------------------------------------------------------------------|
| `npm run lint`      | Run ESLint on all project .js files                                 |
| `npm run security`  | Run node security check                                             |
| `npm run test`      | Run unit tests (mocha)                                              |
| `npm run validate`  | Run all of the above                                                |
| `npm run accept`    | Run acceptance tests (chakram) - requires the server to be running  |

## Swagger API
[Directions](swagger.md "Swagger documentation generation")

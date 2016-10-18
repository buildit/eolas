# eolas
Gaelic - Knowledge (of experience)

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

### Generate test data
To generate test data, run the scripts in "test_data". Each script creates data for one project. For example, this would insert into the local development database one project and it's associated data for status and projection:

```sh
node test_data/testdata1.js
```

To create additional test data, copy the format of the files in "test_data".

To generate this data on Staging:

1. Find the url of the staging instance of the database. To do so, ping Eolas by visiting [this endpoint](http://eolas.staging.buildit.tools/ping). (You must be connected to the VPN to reach the staging API.) Look for the dbUrl value. It looks something like this: `dbUrl: "mongodb://mongodb.buildit.tools:27017"`
2. Open "config/development.json". Point the configuration to the staging instance of the database by setting the value of "dbUrl" in "config/development.json" to the value you found above.
3. In "config/development.json", set "context" to "staging".
4. Run the scripts. E.g.:
```sh
node test_data/testdata1.js
node test_data/testdata2.js
node test_data/testdata3.js
```
5. When you're done, change "config/development.json" back to its previous state.

## Swagger API
[Directions](swagger.md "Swagger documentation generation")

# General Structure (Software) of this app.

Eolas is a Nodejs app that uses Expressjs to expose a REST based service (that is documented via Swagger).  

# Structure

index.js loads the routes and then starts listening.

Express routing is accomplished in the routes directory.

- about.js covers ping, deepPing
- processors.js covers all of the generic handling features (logging, errors, CORS, ...).
- v1 supports the routing of most of the direct calls.

The services directory contains the implementations of the callable services.

- about.js - ping implementation and ping/deep structure.  If you add a new dependant service, implement a deepPing function and call it from here.
- errors.js - the generic express error handler functions.
- swaggerDoc.js - serves up the swagger.json file from the 'appropriate' version in teh api_doc directory.
- dataStore - interfaces for the supported datastore.
- projectSource - interfaces to a project source system.  Used by the client to create new projects.
- v# - contains the implementations for the REST resources.

# API Versioning

API versioning uses a version path in the URL.  Additive changes should not change the API version number (unless you REALLY want to).  To support V2, create a V2 directory in the services directory.  Copy all of the V1 classes and make the necessary changes.  Then create a v2.js in the routes directory and route all calls to those new files.

When and if you get there, you can have a debate.  Do I really need to duplicate all of those files if I am only changing 1 or 2 of them?  No.  Refactor.  Knock yourself out.  Right now this works and is obvious.


# What the heck is this PING and DEEP PING BS

- /ping is a way for the deployed service to let a client know that is loaded and responding.  It also echos its current version and its loaded config data.  Awful handy when someone is telling you that "nothing is working".

- /ping/deep - so /ping responds, but still no data?  /deep "talks" to the datastore and any other external services (think Harvest / project source) to make sure that connection to those services is functioning.

- still not working?  Is there data?  What is your context?


# Convention

- imports / requires are listed in Alpha order
- NPM modules are CamelCase and internal modules are mixedCase
- constants are ALLCAPS (not this call vars as const constants, but real constants)

# Swagger

The Eolas REST API is documented using Swagger.  See this [link](swagger.md "Swagger documentation generation") below for directions on viewing and maintaining said documentation.


# Dependencies

- body-parser - don't really know why we use this.

- co - is used to support a promised based approach to interacting with mongo.  Because frankly those are the examples provided by the npm project and it just works.

- config - supports the description of configuration information in a JSON format.  Respects the NODE_ENV environment variable to determine which config file to load.

- expressjs - yup, this is an express app.  More on that to come.

- http-status-codes - a good constants library.

- log4js - provides the ability support log levels and log in a common format to a file.  Log files are named eloas.log-MM-DD.  Log format is described in the log4js_config.json file in the config directory.  Log level is controlled in the 'default' config.json file.  There is no purge mechanism, so it is possible to accumulated a year's worth of log files.  Not optimal, but so far not an issue.  Will probably need to change that at some point.  Maybe use some DOW mechanism.

It is often handy to have console logging on when debugging so add the following into the appenders list.
```json
	{
		"type": "console",
		"layout": {
			"type": "pattern",
			"pattern": "%d{ABSOLUTE} %[%-5p%] %c %m"
		}
	}
```
- method-override - allows Eolas to support 'standard' HTTP Method override headers to allow clients to get past firewall restrictions on the use of PUT and DELETE HTTP verbs.  Headers X-HTTP-Method, X-HTTP-Method-Override, and X-Method-Override are supported.

- mongodb - is an npm projec that wraps mongodb.  It is really pretty close to the same as the interface described on the mongodb site.  Sitll I rely on thier documentation when making changes.

Right now the interaction with mongo is spread across several files.  If a change of datastore is contemplated (and it has been), the generic functions should be ported into the mongodb.js file within this project.  Then that file can be 'replaced'.

- ramda - don't you love functional programming?  I don't, but still it is handy from time to time.

- response-time - inserts a header into the response that describes the amount of time the request spent in the server.

- reslter - used to call external systems via their own REST interface.  Currently this is limited to Harvest to support the creation of a new project.  This will likely change as we encounter more systems.  the projectSource section of the config file controls which system to call (think switch statement in availaleProjects.js) and the connection credentials.

- try - This is only used in one place.  Could probably refactor this out.  But it is working so why.


# Development Dependencies

- chakram - used to support acceptance testing of the Eolas API
- del - used by gulp to clean out the distribution directory
- eslint - code structure enforcment
- gulp - packaging support
- gulp-rename - allows renaming of files.  Used to generate specific config files from templates.
- gulp-template - remember that template bit?  Macro replacement of text in files.
- mocha - unit testing (also used by chakram)
- node-mocks-http - for unit testing express functions
- nsp - node security vulnerabitly testing.  I don't know, sounded good.
- nyc - code coverage metrics
- should - unit testing assertion library
- shrinkwrap - a packaging library that locks down the version of dependacies for packaging.
- sinon - stubbing and mocking framework.  Should probably get rid of this as I can't get it to do what I want.
- sinon-as-promised - allows Sinon to understand resolve and reject.

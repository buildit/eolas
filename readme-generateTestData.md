
# Generate test data
To generate test data for Eolas, run the scripts in "test_data". Each script creates data for one project. For example, this would insert into the local development database one project and it's associated data for status and projection:

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

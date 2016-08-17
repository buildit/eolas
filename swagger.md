# Generating Swagger style documentation

This section describes how the Swagger style API documentation file for Eolas is generated and maintained.  Eolas does not support the whole Swagger experinece.  That is it is not used to generate stubbs and what not.  The Swagger editor tool is just used to document the Eolas REST experience.  Also, as the swagger doc is served as JSON, Eolas expects the file to be in JSON format.

##  Maintaining the API definitions

- [Launch the Swagger editor](http://editor.swagger.io/#/ "Swagger Editor")
- Use the File->Import option to import the swagger.json file in the api_doc directory of this project.
- Make the necessary edits
- use the File->Download JSON option to save the file back to your machine
- If you didn't save the file to the api_doc directory move it back.

##  Viewing the API definitions

- Install Swagger UI using the instructions listed [here](http://swagger.io/swagger-ui/ "Swagger UI")
- Start Eolas - '''node index.js'''
- Launch the Swagger UI (I just open the index.html in the dist directory)
- Navigate to the Eolas URL (localhost:6565/doc)


[<-BACK](README.md)

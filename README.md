# aurelia-jspm-cli

This is a simple command to help you bootstrap and develop your Typescript Aurelia JSPM application.

## Installing the command

``
npm install aurelia-jspm-cli
``

You can use `auj` command.

## Bootstrap your application

``
mkdir my-app
cd my-app
auj init 
``

The project is ready and you can view a sample page by launching `npm start`.

## During your development

### Auto-reload server

aurelia-jspm-cli comes with an auto-reload light web server (thanks to live-server). Execute :
``npm start``

The browser will open automatically and each time you'll change your source code, the browser will refresh your page.

### Mocking API

You can use the the auto-reload light server and mocking API used by your front-end application. Execute :
``npm run start:mockapi``

Mock server will respond to every uri which start with "/mock/api". Mock server will search for response into 
`test/mockapi` directory. The first subdirectory must be the HTTP method and must contains a path identical to the 
request uri.

For instance, if you need a response to the request `GET /mock/api/blog/65/comments`, you'll have to create the file 
`test/mockapi/GET/blog/65/comments`.


## Preparing for production

TO WRITE






# aurelia-jspm-cli

This is a simple command to help you bootstrap and develop your Typescript Aurelia JSPM application.

## Installing

    npm install aurelia-jspm-cli -g

You can now use `auj` command.

## Bootstraping

To bootstrap your project, execute : 

    mkdir my-app
    cd my-app
    auj init 

Then generate a first vendors bundle using the command `npm run bundle:vendor` to limit number of HTTP requests.

The project is ready and you can view a sample page by launching `npm start`.

## Adding dependency

To help you maintain Typescript types with your JSPM dependencies, you can use this command to install your dependency.

    auj install your-dependency

This command install your dependency with JSPM and with NPM (to handle Typescript types). If the NPM dependency does not 
contain typings, the command will look for corresponding types project.

After adding a dependency, don't forget to update vendors bundle using the command `npm run bundle:vendor`.

## Developing

### Unit test

Karma framework with Mocha and Chai is setup to execute your unit tests. Execute `npm test`.

If you just have bootstrapped your project, you should see 2 completed tests and 1 failed test (just to have some colors
on the output console).
 
### Auto-reload server

aurelia-jspm-cli comes with an auto-reload light web server (thanks to live-server). Execute :
``npm start``

The browser will open automatically and each time you'll change your source code, the browser will refresh your page.

### Mocking API

You can use the the auto-reload light server to mock API used by your front-end application. Execute :
``npm run start:mockapi``

Mock server will respond to every uri which start with "/mock/api". It will search for response into 
`test/mockapi` directory. The first subdirectory must be the HTTP method and must contains a path identical to the 
request uri.

For instance, if you need a response to the request `GET /mock/api/blog/65/comments`, you'll have to create the file 
`test/mockapi/GET/blog/65/comments`.

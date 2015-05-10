# [ResourceCollector](http://osdrc.herokuapp.com) [![Build Status](https://travis-ci.org/DesignOpen/ResourceCollector.svg?branch=travis)](https://travis-ci.org/DesignOpen/ResourceCollector)
The backend Node.js app for submitting open source design resources. It creates Github pull requests for submitted OSD resources via Express API.
## Resource Submissions
### Web Form
Resources can be submitted through an HTML form found on the Open Source Design Resource Collector [site](http://osdrc.herokuapp.com).
###Chrome Extension
The Chrome extension can be downloaded directly from the Chrome Web Store.
Visit the [extension listing](https://chrome.google.com/webstore/detail/design-open/jahbclkpigpnoeamhgdilpdocgicnmml) on the Chrome Web Store and click the "Add to Chrome" button.
###Bookmarklet
The bookmarklet can be found in this [Design Open article](http://designopen.org/articles/resource-collector/#javascript-bookmarklet).
##Testing
###Server
The server side testing of the Resource Collector is done using a BDD testing style utilizing Chai expectations and Mocha testing framework. Using [gulp-spawn-mocha](https://www.npmjs.com/package/gulp-spawn-mocha), the test suites are executed in a separate process, which allows environment variables to be set independently and for the tests to be executed without depending on an instance of Resource Collector to be running. The API is tested using [Supertest](https://www.npmjs.com/package/supertest). API tests executes the POST /api/resource route and makes pull requests to a dummy testing Github repository. Pull requests are then closed after they are made in the tests. The repository can be found [here](https://github.com/osdrc-testing/PRtesting/pulls).

To ensure that the tests run properly in `test:server` gulp task, make sure to change the `github_key` variable found on `line 132` of `gulpfile.js`. A valid Github OAuth key can be found in `test/server/test-api.js` or choose to use a personal one. Server side tests can then be executed in the terminal using the command `gulp test:server`.

Server tests can be found in `test/server/`.
###Client
The client side testing is done using a BDD testing style utilizing Chai expectations and a Mocha framework, executed with a [Test'em](https://www.npmjs.com/package/testem) test runner. The gulp task browserifies the test-form file and then outputs the file into a vanilla JS file. This file is an input in `testem.json` and in  `test/client/testem.html`.

The client side tests can be executed in the terminal using the command `gulp test:client` then in your browser, navigate to http://localhost:7357 to begin the test runner.

Client tests can be found in `test/client`.

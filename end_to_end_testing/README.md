
# End to end testing for the `widget_cookie_cutter_test` Jupyter widget

The implementation uses:

- <a href="https://jestjs.io/">The Jest Javascript testing framework (https://jestjs.io/).</a>

- <a href="https://github.com/puppeteer/puppeteer">The 
puppeteer Headless Chrome Node.js API (https://github.com/puppeteer/puppeteer).</a>

- <a href="https://github.com/smooth-code/jest-puppeteer">The jest-puppeteer integration helper module
(https://github.com/smooth-code/jest-puppeteer).</a>

The technique is based on
<a href="https://github.com/AaronWatters/hello_jest">
https://github.com/AaronWatters/hello_jest --  A hello world example of unit testing and end-to-end testing of Javascript using Jest</a>.

This code is intended to be adapted to provide
integration testing for more interesting widget implementations.

The test suite was built using these versions:

```bash
$ npm -v
6.14.4
$ node -v
v10.13.0
```

To install

```
npm install
```

To run the tests

```
npm test
```

To watch the tests running in slow motion (not headless)

```
HEADLESS="false" SLOWMO=100 npm run test
```

To watch the main test running by itself in slow motion:

```
HEADLESS="false" SLOWMO=100 jest -t "runs a widget in an example notebook"
```


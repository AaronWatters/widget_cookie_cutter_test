
// These end-to-end tests use puppeteer and headless chrome using the default jest-environment configuration.

const fs = require("fs");

describe("headless browser tests", async () => {
    it("gets the browser version",  async () => {
        var version = await browser.version();
        console.log("browser version: " + version);
        expect(version).toBeTruthy();
    },
    120000, // timeout in 2 minutes...
    );
    
    it("gets a page object",  async () => {
        const page = await browser.newPage();
        console.log("page: " + page);
        expect(page).toBeTruthy();
    },
    120000, // timeout in 2 minutes...
    );

    //it("runs the debugger",  async () => {
    //    await jestPuppeteer.debug();
    //});

    it("gets a page title from an error page that talks about Jupyter",  async () => {
        const page = await browser.newPage();
        const url = "http://127.0.0.1:3000/html/index.html";
        // wait for the page to initialize...
        await page.goto(url, {waitUntil: 'networkidle2'});
        await page.waitForFunction(async () => !!(document.title));
        var title = await page.title();
        console.log("error page title is: " + title);
        expect(title.includes("Jupyter")).toBeTruthy();
    },
    120000, // timeout in 2 minutes...
    );

    it("finds a subdirectory on the notebooks index page",  async () => {
        const page = await browser.newPage();
        const url = jupyter_start_url();
        // wait for the page to initialize...
        await page.goto(url, {waitUntil: 'networkidle2'});
        await page.waitForFunction(async () => !!(document.title));
        var title = await page.title();
        console.log("start url page title is: " + title);
        var directory_found = await page.$$eval('span.item_name', (elements) =>
            elements.map((el) => el.textContent.includes('notebook_tests'))
        );
        //var directory_found = await page.$$eval('.item_name', (elements) =>
        //    elements.map((el) => el.textContent)
        //);
        //console.log("" + directory_found.length + " in directory: " + directory_found);
        expect(directory_found).toBeTruthy();
    },
    120000, // timeout in 2 minutes...
    );

    it("opens and closes an example notebook",  async () => {
        const path = "notebooks/notebook_tests/example.ipynb";
        const page = await jupyter_live_page(path);
        // wait for the page to initialize...
        var title = await page.title();
        console.log("example.ipynb page title is: " + title);
        var example_text_found = await page.$$eval('div.input_area', (elements) =>
            elements.map((el) => el.textContent.includes('Some example text'))
        );
        expect(example_text_found).toBeTruthy();
    },
    120000, // timeout in 2 minutes...
    );

    it("runs a widget in an example notebook",  async () => {
        const path = "notebooks/notebook_tests/example.ipynb";
        const confirm_selector = "div.modal-dialog button.btn-danger";
        const widget_selector = ".p-Widget";
        const page = await jupyter_live_page(path);
        const url = jupyter_start_url();
        console.log("wait for the page to initialize...")
        var title = await page.title();
        console.log("example.ipynb page title is: " + title);
        console.log("  restart and clear...")
        await find_and_click(page, "#restart_clear_output a");
        console.log("  confirm restart and clear...")
        await find_and_click(page, confirm_selector, true);
        console.log("   sleep to allow events to clear... (???)")
        await sleep(200);
        console.log("   verify the test text is not found");
        const test_string = "THIS IS THE SECRET TEST STRING";
        const test_before = await substring_exists(page, widget_selector, test_string);
        expect(test_before).toBeFalsy();
        console.log("  restart and run all...");
        await find_and_click(page, "#restart_run_all a");
        console.log("   sleep to allow events to clear... (???)")
        await sleep(200);
        // for some reason the confirm dialog doesn't always appear... check whether it is there.
        var needs_confirmation = await page.evaluate(
            (selector) => !!document.querySelector(selector), 
            confirm_selector);
        if (needs_confirmation) {
            console.log("  confirm restart and run all...");
            // XXXX for reasons I don't understand I had to use an alternate find_and_click implementation here to avoid sporadic failures.
            await find_and_click2(page, confirm_selector, true);
        }
        console.log('... wait for widget output to appear.')
        await page.waitForSelector(widget_selector);
        console.log("Verify that test_string is in widget output")
        const test_after = await substring_exists(page, widget_selector, test_string);
        expect(test_after).toBeTruthy();
    },
    120000, // timeout in 2 minutes...
    );

    async function substring_exists(page, selector, substring) {
        var match_exists = await page.evaluate((selector) => !!document.querySelector(selector), selector);
        if (!match_exists) {
            console.log("no match for selector " + selector)
            return false;  // no selector match, no text match
        }
        var text_found = await page.$$eval(
            selector,
            (elements, substring) => elements.map((el) => el.textContent.includes(substring)),
            substring
        );
        return text_found;
    }

    async function find_and_click(page, selector, wait_to_disappear) {
        // wait til the element exists
        await page.waitFor(250);
        console.log("awaiting selector ", selector);
        await page.waitForSelector(selector);
        console.log("clicking selector ", selector);
        await page.$$eval(selector, (elements) =>
            elements.map((el) => el.click())
        );
        if (wait_to_disappear) {
            console.log("waiting for element to vanish: " + selector)
            await page.waitFor(
                (selector) => !document.querySelector(selector),
                selector);
        }
    };

    async function find_and_click2(page, selector, wait_to_disappear) {
        // alternate implementation...
        var found = false;
        while (!found) {
            found = await page.evaluate(
                async function(selector) {
                    console.log("looking for '" + selector + "' in " + document);
                    // document.querySelector("button.button-danger")
                    var element = document.querySelector(selector);
                    if (element) {
                        console.log("element found " + element);
                        element.click();
                        if (wait_to_disappear) {
                            console.log("waiting for element to vanish: " + selector)
                            await page.waitFor(
                                (selector) => !document.querySelector(selector),
                                selector);
                        }
                        return true;
                    }
                    return false;
                },
                selector
            );
            if (!found) {
                await sleep(250);
            }
        }
    }

    async function jupyter_live_page(path) {
        // get a patge for a notebook using path='notebooks/notebook_tests/example.ipynb'
        var sub_url = jupyter_sub_url(path);
        const page = await browser.newPage();
        // wait for the page to initialize...
        await page.goto(sub_url, {waitUntil: 'networkidle2'});
        await page.waitForFunction(async () => !!(document.title));
        return page;
    }

    function jupyter_sub_url(path) {
        // get a path to a notebook using path='notebooks/notebook_tests/example.ipynb'
        var basic_url = jupyter_start_url();
        return basic_url.replace("?", path + "?");
    }

    function jupyter_start_url() {
        // returns a string like http://localhost:3000/?token=0d1715cefedcff36352180eaeaf1a28d0a01728b7531c45d
        return fs.readFileSync('./_jupyter_url.txt', 'utf8')
    };

    function sleep(time) {
        return new Promise(function(resolve) { 
            setTimeout(resolve, time)
        });
    };

    async function check_truthy(js_expression_str) {
        var is_truthy = await page.evaluate("!!(" + js_expression_str + ")");
        if (is_truthy) {
            console.log("truthy: " + js_expression_str);
        } else {
            console.log("FALSY: " + js_expression_str);
        }
    };

    /*
    it("calls the test function",  async () => {
        //await jestPuppeteer.debug();
        const page = await browser.newPage();
        const url = "http://127.0.0.1:3000/html/index.html";
        await page.goto(url, {waitUntil: 'networkidle2'});
        // Wait for jQuery to become available indicating that javascript has loaded
        await page.waitForFunction(async () => !!(window.jQuery));
        var content = await page.evaluate(async () => window.test_function());
        //console.log("function content is: " + content);
        var expected_content = "hi there!";
        expect(content).toBe(expected_content);
    },
    120000, // timeout in 2 minutes...
    );

    it("sets the html using the plugin",  async () => {
        //await jestPuppeteer.debug();
        const page = await browser.newPage();
        const url = "http://127.0.0.1:3000/html/index.html";
        await page.goto(url, {waitUntil: 'networkidle2'});
        //console.log(" ... now waiting for window.jQuery ...")
        await page.waitForFunction(async () => !!(window.jQuery));
        //console.log(" ... now awaiting window.jQuery.ready_for_tests")
        await page.waitForFunction(async () => !!(window.jQuery.ready_for_tests));
        // Validate that the plugin code executed.
        var content = await page.evaluate(async () => window.jQuery('#target').text());
        //console.log("target content is: " + content);
        var expected_content = "plugin is working";
        expect(content).toBe(expected_content);
    },
    120000, // timeout in 2 minutes...
    );
    */
});

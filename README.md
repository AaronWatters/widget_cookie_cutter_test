widget_cookie_cutter_test
===============================

[![Binder](https://mybinder.org/badge.svg)](https://mybinder.org/v2/gh/AaronWatters/widget_cookie_cutter_test/master?filepath=test.ipynb)

[![Build Status](https://travis-ci.org/AaronWatters/widget_cookie_cutter_test.svg?branch=master)](https://travis-ci.org/AaronWatters/widget_cookie_cutter_test)

Test of widget cookie cutter for custom Jupyter widgets

Installation
------------

To install use pip:

    $ pip install git+https://github.com/aaronwatters/widget_cookie_cutter_test
    $ jupyter nbextension enable --py --sys-prefix widget_cookie_cutter_test

To install for jupyterlab

    $ jupyter labextension install widget_cookie_cutter_test

For a development installation (requires npm),

    $ git clone https://github.com/AaronWatters/widget_cookie_cutter_test.git
    $ cd widget_cookie_cutter_test
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --sys-prefix widget_cookie_cutter_test
    $ jupyter nbextension enable --py --sys-prefix widget_cookie_cutter_test

<a href="https://mybinder.org/v2/gh/AaronWatters/widget_cookie_cutter_test/master?urlpath=lab/tree/test.ipynb">
Try it in Jupyterlab</a>


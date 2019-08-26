widget_cookie_cutter_test
===============================

Test of widget cookie cutter for custom Jupyter widgets

Installation
------------

To install use pip:

    $ pip install widget_cookie_cutter_test
    $ jupyter nbextension enable --py --sys-prefix widget_cookie_cutter_test


For a development installation (requires npm),

    $ git clone https://github.com/AaronWatters/widget_cookie_cutter_test.git
    $ cd widget_cookie_cutter_test
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --sys-prefix widget_cookie_cutter_test
    $ jupyter nbextension enable --py --sys-prefix widget_cookie_cutter_test

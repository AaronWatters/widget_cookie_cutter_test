from ._version import version_info, __version__

from .example import *

def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'static',
        'dest': 'widget_cookie_cutter_test',
        'require': 'widget_cookie_cutter_test/extension'
    }]

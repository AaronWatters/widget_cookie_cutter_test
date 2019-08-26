var plugin = require('./index');
var base = require('@jupyter-widgets/base');

module.exports = {
  id: 'widget_cookie_cutter_test',
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'widget_cookie_cutter_test',
          version: plugin.version,
          exports: plugin
      });
  },
  autoStart: true
};


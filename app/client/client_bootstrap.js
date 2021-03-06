define([
  'stagecraft_api_client',
  './controller_map',
  'lodash',
  'modernizr',
  './preprocessors/visualisation_fallback',
  './preprocessors/report_a_problem'
],
function (StagecraftApiClient, controllerMap, _, Modernizr) {

  var bootstrap = function (config) {

    if (config.clientRequiresCors && !(Modernizr.cors || window.XDomainRequest)) {
      // Don't bootstrap client in non-CORS browsers when CORS is required
      return;
    }

    var model = new StagecraftApiClient(config, {
      parse: true,
      ControllerMap: controllerMap
    });

    var ControllerClass = model.get('controller');
    if (ControllerClass) {
      var controller = new ControllerClass({
        model: model,
        url: model.get('url')
      });
      controller.on('ready', function () {
        $('body').addClass('ready');
        preprocessors();
      });
      controller.on('loaded', function () {
        $('body').addClass('loaded');
      });
      controller.render({ init: true });
      return controller;
    } else {
      $('body').addClass('ready loaded');
      preprocessors();
    }
  };

  var preprocessors = function () {
    _.each(bootstrap.preprocessors, function (preprocessor) {
      preprocessor();
    });
  };

  bootstrap.preprocessors = Array.prototype.slice.call(arguments, -2);

  return bootstrap;
});

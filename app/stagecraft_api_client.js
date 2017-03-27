define([
  'extensions/models/model'
],
function (Model) {
  var StagecraftApiClient = Model.extend({

    defaults: {
      status: 200
    },

    initialize: function (attrs, options) {
      this.controllers = options.ControllerMap;
      this.requestId = options.requestId || 'Not-Set';
      this.govukRequestId = options.govukRequestId || 'Not-Set';
      this.set('params', attrs.params);
      Model.prototype.initialize.apply(this, arguments);
    },

    setPath: function (path) {
      this.path = path.split('?')[0];
      this.fetch();
    },

    url: function () {
      if(this.path && this.path.length){
        return this.stagecraftUrlRoot + '?slug=' + this.path.replace(/^\//, '');
      } else {
        return this.stagecraftUrlRoot;
      }
    },

    fetch: function (options) {
      options = _.extend({}, {
        validate: true,
        headers: {
          'GOVUK-Request-Id': this.govukRequestId,
          'Request-Id': this.requestId
        },
        error: _.bind(function (model, xhr) {
          logger.info('failed to fetch stagecraft response', {
            'path': model.path,
            'status': xhr.status,
            'responseText': xhr.responseText
          });
          this.set('controller', this.controllers.error);
          this.set('status', xhr.status);
        }, this)
      }, options);
      logger.info('Fetching <%s>', this.url(), {
        request_id: this.requestId,
        govuk_request_id: this.govukRequestId
      });
      Model.prototype.fetch.call(this, options);
    },

    parse: function (data, options) {

      function addControllerMap(module) {
        module.controller = controllerMap.modules[module['module-type']];
        if (module.controller) {
          // requiring the controller map from within a module causes a circular dependency
          // so add the map as a property for modules that need it i.e. tabs
          module.controller.map = controllerMap.modules;
        }
        _.each(module.modules, addControllerMap);
      }

      var controller;
      var controllerMap = this.controllers || options.ControllerMap;

      controller = controllerMap[data['page-type']];

      if (data['page-type'] === 'module') {
        controller = controllerMap.dashboard;
      }

      _.each(data.modules, addControllerMap);

      if (!controller) {
        data.controller = controllerMap.error;
        data.status = 501;
      } else {
        data.controller = controller;
      }
      return data;
    }

  });

  return StagecraftApiClient;
});

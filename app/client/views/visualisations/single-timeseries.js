define([
  'common/views/visualisations/single-timeseries',
  'client/views/visualisations/single-stat-graph'
], function (View, GraphView) {

  return View.extend({

    views: function () {
      var views = View.prototype.views.apply(this, arguments);
      return _.extend(views, {
        '.volumetrics-completion': {
          view: GraphView,
          options: {
            valueAttr: this.valueAttr,
            formatOptions: this.formatOptions
          }
        }
      });
    }

  });

});
define([
  'extensions/views/table',
  'extensions/views/hideShow'
],
function (Table, HideShow) {
  return Table.extend({
    initialize: function () {
      this.$toggleContainer = $('<div>', {'class': 'table-toggle'});

      this.isModule = (this.model.get('page-type') === 'module');

      Table.prototype.initialize.apply(this, arguments);
      this.stopListening(this.collection, 'reset add remove sync', this.render);
    },

    prepareTable: function () {
      var label = 'Table view of “' + this.model.get('title') + '” data';
      this.$table = $('<table/>');
      this.$table.appendTo(this.$toggleContainer);
      this.$toggleContainer.appendTo(this.$el);
      this.toggleTable = new HideShow({
        $reveal: this.$table,
        $el: this.$toggleContainer,
        showLabel: label,
        hideLabel: label,
        isModule: this.isModule
      });
    },

    // Show the hidden tables before calling floatHeaders, as it relies on their
    // visible width on the page. Hide them again immediately after.
    floatHeaders: function () {
      this.toggleTable.show();
      Table.prototype.floatHeaders.apply(this, arguments);
      if (!this.isModule) {
        this.toggleTable.hide();
      }
    },

    remove: function () {
      if (this.toggleTable) {
        this.toggleTable.remove();
      }
      return Table.prototype.remove.apply(this, arguments);
    }
  });
});

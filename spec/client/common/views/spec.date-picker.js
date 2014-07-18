define([
  'client/views/date-picker',
  'extensions/models/model',
  'extensions/collections/collection'
], function (DatePicker, Model, Collection) {

  describe('Date Picker', function () {

    var datepicker, model, collection;

    beforeEach(function () {
      collection = new Collection();
      collection.dataSource.setQueryParam('period', 'week');
      model = new Model({
        'date-picker': {}
      });
      datepicker = new DatePicker({
        model: model,
        collection: collection
      });
    });

    describe('initialize', function () {

      it('sets start date from model if it exists', function () {
        model.set('date-picker', {
          'start-date': '2014-04-01T00:00:00Z'
        });
        datepicker = new DatePicker({
          model: model,
          collection: collection
        });
        expect(datepicker.startDate).toEqual('2014-04-01T00:00:00Z');
      });

    });

    describe('render', function () {

      it('adds a pair of select boxes', function () {
        datepicker.render();
        expect(datepicker.$('select').length).toEqual(2);
        expect(datepicker.$('select').eq(0).attr('id')).toEqual('date-from');
        expect(datepicker.$('select').eq(1).attr('id')).toEqual('date-to');
      });

    });

    describe('events', function () {

      beforeEach(function () {
        spyOn(collection.dataSource, 'setQueryParam');
        datepicker.render();
      });

      it('writes the start and end dates to the collection datasource on change', function () {

        datepicker.$('#date-from').val('2013-06-01T00:00:00Z');
        datepicker.$('#date-to').val('2014-06-01T00:00:00Z');
        datepicker.$('#date-from').change();

        expect(collection.dataSource.setQueryParam).toHaveBeenCalledWith({
          // start date is rounded down to nearest monday
          start_at: '2013-05-27T00:00:00Z',
          // end at is rounded to the end of the month to fully encompass the data
          end_at: '2014-06-30T23:59:59Z'
        });

      });

      it('sets end date to current date if end date is after current date', function () {
        // TODO
      });

    });

  });

});
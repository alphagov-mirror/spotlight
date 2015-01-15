var BaseView = require('../../../app/server/views/govuk');
var HomePageView = require('../../../app/server/views/homepage');

describe('Homepage', function () {

  var view;

  beforeEach(function () {
    view = new HomePageView();
  });

  it('extends govuk view', function () {
    expect(view instanceof BaseView).toBe(true);
  });

});

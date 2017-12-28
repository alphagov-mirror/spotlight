define([],
function () {
  var getGovUkUrl = function (req) {
    return [process.env.GOVUK_WEBSITE_ROOT, req.originalUrl].join('');
  };

  var commonConfig = function (req) {
    return {
      url: req.originalUrl,
      govukUrl: this.getGovUkUrl(req),
      requirePath: req.app.get('requirePath'),
      assetPath: req.app.get('assetPath'),
      assetDigest: req.app.get('assetDigest'),
      environment: req.app.get('environment'),
      backdropUrl: req.app.get('backdropUrl'),
      externalBackdropUrl: req.app.get('externalBackdropUrl'),
      clientRequiresCors: req.app.get('clientRequiresCors'),
      requestId: req.get('Request-Id'),
      govukRequestId: req.get('GOVUK-Request-Id')
    };
  };

  var PageConfig = {};

  PageConfig.getGovUkUrl = getGovUkUrl;
  PageConfig.commonConfig = commonConfig;

  return PageConfig;
});

define([
  'common/views/module',
  'extensions/collections/collection',
  'extensions/models/model',
  'extensions/views/view'
],
function (ModuleView, Collection, Model, View) {
  describe('ModuleView', function () {

    var moduleView, model;

    var getContent = function () {
      return moduleView.$el[0].outerHTML.replace(/>\s+?</g, '><');
    };

    beforeEach(function () {
      var Visualisation = View.extend({
        render: function () {
          this.$el.html('test content');
        }
      });
      model = new Model({
        title: 'A Title',
        slug: 'slug'
      });
      var collection = new Collection();
      moduleView = new ModuleView({
        visualisationClass: Visualisation,
        className: 'testclass',
        collection: collection,
        model: model
      });
    });

    afterEach(function () {
      moduleView.remove();
    });

    it('renders a module', function () {
      moduleView.render();
      expect(getContent()).toEqual('<section aria-labelledby="slug-heading" role="region" class="testclass"><h2 id="slug-heading">A Title</h2><div class="visualisation">test content</div></section>');
    });

    it('renders a module with description', function () {
      model.set('description', 'Description');
      moduleView.render();
      expect(getContent()).toEqual('<section aria-labelledby="slug-heading" role="region" class="testclass"><h2 id="slug-heading">A Title</h2><h3>Description</h3><div class="visualisation">test content</div></section>');
    });

    it('renders a module with description', function () {
      model.set('description', 'Description');
      model.set('parent', new Model({
        slug: 'parentSlug'
      }));
      moduleView.render();
      expect(getContent()).toEqual('<section aria-labelledby="slug-heading" role="region" class="testclass"><h2 id="slug-heading"><a href="parentSlug/slug">A Title</a></h2><h3>Description</h3><div class="visualisation">test content</div></section>');
    });

    it('renders a module with description and info', function () {
      model.set('description', 'Description');
      model.set('info', ['Info line 1', 'Info line 2']);
      moduleView.render();
      expect(getContent()).toEqual('<section aria-labelledby="slug-heading" role="region" class="testclass"><h2 id="slug-heading">A Title</h2><h3>Description</h3><div class="visualisation">test content</div></section>');
    });

    it('renders a module with description and info link', function () {
      model.set('description', 'Description');
      model.set('info', ['<a href="https://example.com/">Info line 1</a> with trailing text', 'Info line 2']);
      moduleView.render();
      expect(getContent()).toEqual('<section aria-labelledby="slug-heading" role="region" class="testclass"><h2 id="slug-heading">A Title</h2><h3>Description</h3><div class="visualisation">test content</div></section>');
    });

    it('renders an SVG-based module as a fallback element on the server', function () {
      jasmine.serverOnly(function () {
        moduleView.requiresSvg = true;
        moduleView.url = '/test/url';
        moduleView.render();

        // normalise jsdom and phantomjs output
        var content = getContent()
          .replace('&lt;', '<')
          .replace('&gt;', '>')
          .replace(' />', '/>');

        expect(content).toEqual('<section aria-labelledby="slug-heading" role="region" class="testclass"><h2 id="slug-heading">A Title</h2><div class="visualisation-fallback" data-src="/test/url.png"><noscript><img src="/test/url.png"/></noscript></div></section>');
      });
    });

    it('renders an SVG-based module as normal on the client', function () {
      jasmine.clientOnly(function () {
        moduleView.requiresSvg = true;
        moduleView.render();
        expect(getContent()).toEqual('<section aria-labelledby="slug-heading" role="region" class="testclass"><h2 id="slug-heading">A Title</h2><div class="visualisation">test content</div></section>');
      });
    });

  });
});

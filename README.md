[![Build status](https://travis-ci.org/alphagov/spotlight.svg?branch=master)](https://travis-ci.org/alphagov/spotlight)

[![Dependency status](https://gemnasium.com/alphagov/spotlight.svg)](https://gemnasium.com/alphagov/spotlight)

# Spotlight #

Hybrid rendering app for the GOV.UK Performance Platform using [Backbone][]
and [D3][]. JavaScript is shared between the client and server, and the app
makes use of [progressive enhancement][] to provide a great experience in
every browser.

[Backbone]: http://backbonejs.org/
[D3]: http://d3js.org/
[progressive enhancement]: https://www.gov.uk/service-manual/making-software/progressive-enhancement

## Building and running the app ##

### Development ###

**Just Spotlight:** The simplest way to get started is to run just this
app, against production data.

Firstly, it is recommended that you set up Node Version Manager on your host. See the ([nvm]) README for installation instructions.

[nvm]: https://github.com/creationix/nvm

Next checkout the Spotlight repo and create an .nvmrc file in its
root directory containing the version of node specified in the 'engines' entry
in `package.json` e.g. `6.11.2`.

Now install the specified version of node using nvm:

```bash
nvm install 6.11.2
```

To check you have the correct version of node installed:

```bash
nvm which

Found '/Users/<username>/<path to>/spotlight/.nvmrc' with version <6.11.2>
/Users/<username>/.nvm/versions/node/v6.11.2/bin/node
```

Now tell nvm to use the version of node specified in the `.nvmrc` file:


```bash
nvm use
```

You can then run the app as follows:

```bash
npm install
npm start
```

Now you should be able to connect to the app at `http://localhost:3057`.

The app uses [node-supervisor][] and [grunt-contrib-watch][] to monitor changes,
automatically restart the server and recompile Sass.

[node-supervisor]: https://github.com/isaacs/node-supervisor
[grunt-contrib-watch]: https://github.com/gruntjs/grunt-contrib-watch

By default, this will look at production data, but perhaps you want to connect
to a different data source. You can do that
by creating your own config file in `/config/config.development_personal.json` that mimics
`/config/config.development.json` with a different `backdropUrl` property. It'll be ignored by Git.

**Full stack:** if you're using our development environment then you can run all
our apps in one go and use a real database for development.
As a bonus, this will let you test the image fallbacks using the
[screenshot-as-a-service][screenshot-as-a-service] app.

First, you need to set up [the Performance Platform development environment][ppdev].

Once you have a machine with the required system-level dependencies, you can run the application with:

```bash
cd /var/apps/pp-puppet/development
bowl performance
```

[ppdev]: https://github.com/alphagov/pp-development
[screenshot-as-a-service]: https://github.com/alphagov/screenshot-as-a-service

### Running tests ###

#### Command line ####

The Jasmine tests are divided into ones that work on the client (`test/spec/client`), and ones that work on the server (`test/spec/server` and `test/spec/shared`). The client tests are run using Jasmine v2.x, while the server tests are using Jasmine v1.x. It used to be that both were written for Jasmine v1, but after upgrading node versions our client tests needed to be upgraded.

`npm test` runs both client and server tests, as well as linting the codebase:

- `npm run jasmine_node` executes server Jasmine tests in Node.js
- `npm run jasmine` executes client Jasmine tests in PhantomJS
- `npm run shell:cheapseats` executes feature tests using [cheapseats][] with a small subset of dashboards, for speed
- `npm run shell:cheapseats_full_run` runs cheapseats with all dashboards
- `npm run test:functional` executes functional tests using [nightwatch][https://github.com/beatfactor/nightwatch]

##### Functional tests #####
As part of the CI (travis) `npm run test:functional:ci` is run. This spins up an instance of spotlight, nightwatch and phantomjs to run the tests in a headless environment.

To assist with debugging the functional tests can also be run in a selenium webdriver using the following command `npm run test:functional:ff`

If you want to run against firefox,chrome and phantom you can also do `npm run test:functional:all`.

All the functional tasks except `ci` will require a server to be running already.

[cheapseats]: https://github.com/alphagov/cheapseats

#### Debugging locally ####

Install node-inspector where the app runs with `sudo npm install -g node-inspector@0.5.0`
and run it with `node-inspector`.

Start the app with `node --debug app/server.js` and visit `http://spotlight.perfplat.dev:8080/debug`
to view the console.

### Production ###

`npm run build:production` to create a production release.

`NODE_ENV=production node app/server.js` to run the app in production mode.

### Heroku ###

If you want to deploy the app to Heroku, follow these instructions.

#### Create an app on Heroku

Using the web interface, or the CLI:

```bash
heroku create <app-name>
```

#### Set the app to use the node-grunt buildpack

The app runs on Heroku using [a custom buildpack for Grunt.js support][buildpack].

This means it will run the grunt commands we need to compile the app when deploying code.

```bash
 heroku config:set BUILDPACK_URL=https://github.com/mbuchetics/heroku-buildpack-nodejs-grunt.git
 ```

#### Set configuration vars

```bash
heroku config:set NODE_ENV=development # makes app run in development mode
heroku config:set npm_config_production=true # does not install dev dependencies
```

#### Deploy the code

If the code you're deploying is not in master, then you'll need to make sure you specify your local branch to push to master. Otherwise it will just deploy your local master (and probably not work as expected).

```bash
git push heroku <your-branch-name>:master
heroku open # opens the freshly deployed app in a browser
```

#### Or just...

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

If you want the Heroku app to be password-protected, set config variables as follows,
before pushing the code.

```bash
heroku config:set BASIC_AUTH_USER=xxxx
heroku config:set BASIC_AUTH_PASS=xxxx
heroku config
```

#### Logging

You might also want to enable some logging in your Heroku app to assist with debugging. You can use logentries to do that:

```bash
heroku addons:add logentries
```

You can then access the logs from your app's dashboard on Heroku (under the "Add-ons" section).

[buildpack]: https://github.com/mbuchetics/heroku-buildpack-nodejs-grunt

## Contributing

For Javascript, follow the [styleguide](https://github.com/alphagov/styleguides/blob/master/js.md) (apart from the sections on GOV.UK modules as we don't use these)

Functionality should work without Javascript where possible.

All content should work well with screenreaders (at least Voiceover and JAWS).
'Work well' means
- a screenreader user can orientate themselves effectively and use the page.
- async updates are reported to the user (an 'accessibility' module exists for this).

## Notes for Developers ##
### Tables ###

Tables are used in the following places:

1. To display a list of dashboards on the services, web-traffic and other dashboards pages
2. To display data on a dashboard, e.g. [a web-traffic dashboard][1]
3. To be displayed instead of a graph if javascript is disabled.

[1]: https://www.gov.uk/performance/site-activity-department-for-communities-and-local-government


#### Configuration ####

As there are more tables underpinning graphs than any other tables in spotlight, table columns are configured as though they are the axes on a graph.

Columns defined in the x-axis will appear before those in the y-axis.

For example, axes defined as:

    axes: {
        x: {
          key: 'key_X',
          label: 'Label X'
        },
        y: [
          {
            key: 'key_Y_one',
            label: 'Label Y1',
            format: 'integer'
          },
          {
            key: 'key_Y_two',
            label: 'Label Y2',
            format: 'integer'
          }
        ]
    }

Will be displayed as:

<table>
  <tr>
   <th>Label X</th>
   <th>Label Y1</th>
   <th>Label Y2</th>
  </tr>
  <tr>
   <td>Value X</td>
   <td>Value Y One</td>
   <td>Value Y Two</td>
  </tr>
</table>

The y-axis only accepts a list of column configuration.

The x-axis will accept a list or a single value. If a list is provided, the columns will appear in reverse order in the table.
For example, x-axis columns defined as:

    x: [
      {
        key: 'key_X_one',
        label: 'Label X1'
      },
      {
        key: 'key_X_two',
        label: 'Label X2'
      }
    ]


Will be displayed as:

<table>
  <tr>
   <th>Label X2</th>
   <th>Label X1</th>
  </tr>
  <tr>
   <td>Value X Two</td>
   <td>Value X One</td>
  </tr>
</table>

Axes configuration is most commonly found in the module visualisation settings, and can be edited via the admin app.

Configuration for tables displaying lists of dashboards can be found in their respective controllers.

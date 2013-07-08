myplaces-app
=============

An app for tracking my favourite locations built with flask, and backbone.js

Project features include:

* Decoupled project structure that allows to separately reuse model, configuration, and API service in different apps / namespaces (setuptools integration)
* Database abstraction (SQLAlchemy)
* Unit / Integration tests for the API service (nose)
* REST API / JSON back-end service (Flask-Restless)
* Server-side pagination & sample validation of API calls
* Flexible configuration, Jinja templates (e.g.: logging - Heroku-friendly or standalone, assets, production Google API keys)
* UI tests (Mocha, testem)
* Deployment helpers for both dev and gunicorn/WSGI
* Maven integration (for kicks), that allows for easy building on the go, and integration with CI such as Jenkins

Webapp features:
* Desktop & Mobile-friendly interface (Twitter-bootstrap integration)
* Sample validation of user input
* Google maps integration for displaying map of locations
* Adding a new location tries to geolocate the user as a starting point
* User can drag markers on screen for more precise address picking
* Rudimentary prevention of place deletion
* Search by location
* Pagination

Getting Started
---------------

### Installing dependencies

You may want to initialize a virtualenv for your project:

    $ virtualenv proj_env
    $ source proj_env/bin/activate

Install the python package dependencies using PIP:

    $ pip install -r requirements.txt

### Build

To build the project, you may either use:

* Java/Maven (or CI) users can execute the following command from root

    $ mvn install

   It will build the the tools,model,services,webapp in the proper order and run all tests

* If you prefer, you can enter each module and use setup-tools to test or install it, such as:

    $ cd services
    $ python setup.py [test,install]

* You may also use foreman

    $ foreman start

### Creating the database

You will need to configure your database settings and then perform the required database initialization.
For development purposes, sqlite is used, whereas in production, the current config grabs the DATABASE_URI os env var.

    $ cd webapp
    $ python db_create.py

To recreate the db, you may use:

    $ python db_recreate.py

### Running for development

    $ cd webapp
    $ python app.py


### Project Structure

The project features a decoupled structure that allows to separately reuse model, configuration, and API services.
It is overkill for a simple application like this, but exists to give a possible solution to a problem of a monolithic codebase, with different teams contributing in different packages that can be tested separately, and reused.

The ./tools project contains a sample namespace (org.awesome.tools) containing configuration files for now, but demonstrates how a company wide settings package can be used for different .py applications.

The ./model package contains the MyPlace data model, central to our app. Features abstraction by SQLAlchemy and some rudimentary validation / exception mechanism. Does not manipulate the DB on its own.

the ./services package contains a sample MyPlaceService that uses the configuration from the tools and model to provide a JSON RESTful API service. It can be run on its own (for example, by certain internal teams for data mining, etc.) or can be packaged by the webapp (using Blueprints for flexibility).
It features also some unit/integration tests as a demonstration.

the ./webapp is our jinja/backbone/twitter-bootstrap based single-page application. Besides the ./app.py blueprint orchestrator, the main codebase is in /static. ./static/main.js is our entry-point (Router), and ./models ./views contain our model and views, respectively. Separation between the Views and html template is done by placing the latter in the ./static/tmpl_include folder and loading them at startup.
Assets are used by Flask-Bootstrap integration, so they should be CDN delivered in production, for example, and tests are in the ./tests directory.

#### Upgrading Javascript libraries

If you want newer versions of the .js libraries used in ./webapp, use node to install libraries, and place them under ./webapp/lib or respective location

    $ npm install -g jquery jsdom underscore backbone mocha chai sinon sinon-chai testem

Testing:
--------
Some sample tests are done on the service level and the webapp level, demonstrating use of python and JS tests

For nose tests (py), check out here:

    $ <app_root>/services/test/myplace_service_tests.py

You can run them by

    $ cd services
    $ python setup.py test

For javascript tests, check out here:

    $ <app_root>/webapp/tests/test_model_and_app.js

You can run them all by:

    $ cd webapp
    $ testem ci

Or run them for TDD by:

    $ testem

Deployment:
-----------

Deployment is done using gunicorn (Demo is hosted on heroku)

For standalone, just build the project, and:
    $ cd webapp
    $ gunicorn app:frontend

You can also use foreman with the Procfile provided

Demo:
-----------
Visit my[guesswhat]places.herokuapp.com :-)


To Do
---------------
Things that are still (IMHO) desired for a larger production app, not yet in (need time):

* Front gunicorn with nginx (somewhat convoluted on Heroku)
* Localization (flask-babel) for example
* Emitting the model instead of having it both in py and js (perhaps using tornado-backbone)
* Packing the js together & minify when in production
* Authentication for API and webapp
* API reference documentation (perhaps using Sphinx)
* Database migration (using flask-migrate or alembic)
* Full fledged validation framework for both API and UI
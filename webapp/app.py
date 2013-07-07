'''
Created on Jun 21, 2013

@author: varnaudov

This is the webapp launcher; orchestrates blueprint registration for backend/frontend,
supplies config parameters to the frontend app and uses twitter Bootstrap flask integration
to provide us with an easily-managed bootstrap infrastructure
'''

import flask
from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound
import flask_sqlalchemy as sqlalchemy
from flask_bootstrap import Bootstrap
import flask_assets as webassets

import logging
import os
import os.path

from werkzeug.wsgi import DispatcherMiddleware
from werkzeug.serving import run_simple

# Grab our service
from org.awesome.services.myplace_service import MyPlaceService
# Change appConfig to devConfig or whatever is being used
from org.awesome.tools.config_prod import WebappProductionConfiguration as appConfig
from org.awesome.model.myplace import db as db

# Expose API constructs through this module
frontend = flask.Flask("mypoiserviceWebapp")
frontend.config.from_object(appConfig)

# call flask_bootstrap for easy use twitter bootstrap provisioning
Bootstrap(frontend)

# our front-end app entrypoint
@frontend.route('/')
def index():
    return render_template('index.html', config=appConfig)
    # return "gruh"

# initialize the service
db.init_app(frontend)

# register the blueprint to the app, so that both service and app are provided
backendSvc = MyPlaceService()
frontend.register_blueprint(backendSvc.get_blueprint())

if __name__ == '__main__':
    """
    Start the app in development / or other testing mode through the entrypoint
    """
    print "The current config is: {}".format(appConfig.DEBUG)
    run_simple('192.168.1.8', 5000, frontend,
               use_reloader=True, use_debugger=True, use_evalex=True)

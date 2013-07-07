'''
Created on Jul 6, 2013

@author: varnaudov
'''
import flask
from flask_sqlalchemy import SQLAlchemy
from flask_restless import APIManager
from flask import request

import logging
from logging.handlers import RotatingFileHandler

from org.awesome.tools.config_prod import ProductionConfiguration as config
from org.awesome.model.myplace import MyPlace
from org.awesome.model.myplace import db


class MyPlaceService():
    """
    A RESTful service, exposing the MyPlace model, interacting with a persistence tier
    (using SQLAlchemy for persistence). C
    Currently delegates some validations to the model and can further implement auth/authz
    Handles exceptions
    Handles some pagination
    Exposes a blueprint that can be used for embedding this service in different apps
    """

    # define the application as a class obj
    app = flask.Flask("mypoiservice")

    def __init__(self):
        """
        Initialize the application, its context, and the API manager
        """
        self.app.config.from_object(config)
        # init the logging and context
        self.setup_logging();
        self.app.test_request_context().push()
        # grab the database from the model, init the service
        db.init_app(self.app)
        # Create the Flask-Restless API manager.
        self.manager = APIManager(self.app, flask_sqlalchemy_db=db)
        # define the blueprint
        self.myplaceServiceBlueprint = self.manager.create_api_blueprint(
                                                               MyPlace,
                                                               # if a custom URL prefix is desired: url_prefix='/api/',
                                                               methods=['GET', 'POST', 'PUT', 'DELETE'],
                                                               preprocessors=dict(GET_MANY=[self.preprocessor]))
        self.app.logger.info('MyService blueprint created')


    def setup_logging(self):
        """
        Set up some rudimentary logging for production *and* for hosting situations
        It might be better to move this to the tools package, as it can be reused, but will need more
        configuration for usage by different services (TODO)
        """
        if not config.DEBUG:
            file_handler = RotatingFileHandler('logs/myservice.log', 'a', 1 * 1024 * 1024, 10)
            file_handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))
            self.app.logger.setLevel(logging.INFO)
            file_handler.setLevel(logging.INFO)
            self.app.logger.addHandler(file_handler)
            self.app.logger.info("App hosting logging started...")

        if config.HOSTING is not None:
            stream_handler = logging.StreamHandler()
            self.app.logger.addHandler(stream_handler)
            self.app.logger.setLevel(logging.INFO)
            self.app.logger.info("App hosting logging started...")

    def get_blueprint(self):
        """
        Return the service blueprint for inclusion in apps
        """
        return self.myplaceServiceBlueprint;

    def preprocessor(self, search_params=None, **kw):
        """
         Preprocessor can be used for auth if needed
         for now, let it remain unused
        """
        return


    def run_standalone(self):
        """
        For when the library needs to be up and running on its own
        """
        self.app.register_blueprint(self.myplaceServiceBlueprint)
        self.app.run(config.API_SERVICE_HOST, config.API_SERVICE_PORT)

    def shutdown_server(self):
        """
        In case we want to shut down the standalone service
        (a hook can be implemented to trigger this)
        """
        func = request.environ.get('werkzeug.server.shutdown')
        if func is None:
            raise RuntimeError('Not running with the Werkzeug Server')
        func()
        return

"""
If service is to be run standalone
"""
if __name__ == '__main__':
    MyPlaceService().run_standalone()



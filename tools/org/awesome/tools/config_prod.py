'''
@author: varnaudov
'''
from config import Configuration, DevConfiguration

import os

class ProductionConfiguration(DevConfiguration):
    '''
    A production configuration for the API service if running standalone
    '''
    DEBUG = False

    # Handle both standalone production and heroku config (puts it in database_url env var)
    if os.environ.get('DATABASE_URL') is None:
        SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/test.db'  # myplaceapp.db
    else:
        SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']

    API_SERVICE_HOST = "localhost"
    API_SERVICE_PORT = 5432

    HOSTING = os.environ.get('HEROKU')

class WebappProductionConfiguration(ProductionConfiguration):
    '''
    Webapp production configuration
    '''

    WEBAPP_HOST = "localhost"
    WEBAPP_PORT = 5000

    ASSETS_MINIFY = True
    ASSETS_USE_CDN = True

    # Do not minify assets in debug; h5 boilerplate ease of use
    BOOTSTRAP_USE_MINIFIED = True
    BOOTSTRAP_JQUERY_VERSION = '1.7.2'
    BOOTSTRAP_HTML5_SHIM = True
    BOOTSTRAP_USE_CDN = True

    # google api key
    API_KEY = 'AIzaSyCoOr2ufJVOqGmUOHi8ABmbcCqwwz3W9rI'


    def __init__(self):
        '''
        Constructor; give us a reassuring printout :-)
        '''
        status = "Webapp Production Config: Current status for debug is {debug} and cdn is {cdn}"
        print status.format(debug=self.DEBUG, cdn=self.ASSETS_USE_CDN)

if __name__ == '__main__':
    config = WebappProductionConfiguration()


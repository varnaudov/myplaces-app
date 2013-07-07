'''
Created on Jul 6, 2013

@author: varnaudov
'''

import os

class Configuration(object):
    '''
    A base configuration class
    '''
    DEBUG = True

class DevConfiguration(object):
    '''
    A base development config
    '''

    DEBUG = True
    SQLALCHEMY_DATABASE_URI = "sqlite:////tmp/test.db"

    # Do not minify assets in debug; h5 boilerplate ease of use
    ASSETS_MINIFY = False
    ASSETS_USE_CDN = False

    API_SERVICE_HOST = "localhost"
    API_SERVICE_PORT = 5432

    WEBAPP_HOST = "localhost"
    WEBAPP_PORT = 5000

    ASSETS_MINIFY = True
    ASSETS_USE_CDN = True

    # Do not minify assets in debug; h5 boilerplate ease of use
    BOOTSTRAP_USE_MINIFIED = False
    BOOTSTRAP_JQUERY_VERSION = '1.7.2'
    BOOTSTRAP_HTML5_SHIM = True
    BOOTSTRAP_USE_CDN = False
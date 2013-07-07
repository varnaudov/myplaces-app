'''
Created on Jul 1, 2013

@author: varnaudov
'''
import unittest

from org.awesome.model.myplace import MyPlace
from org.awesome.model.myplace import db
from org.awesome.services.myplace_service import MyPlaceService

from flask_restless import APIManager
import requests

class ServiceTest(unittest.TestCase):
    """
    Integration-tests for myplaces service
    A sample test for database operation and REST operation are included; more can/will be added when time permits
    """

    def setUp(self):
        """
        Set up app and other test objects
        """
        # use test configuration instead of dev/production config files
        self.svc = MyPlaceService()
        self.svc.app.config['DEBUG'] = True
        self.svc.app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/integration-tests.db"
        # init the app context
        self.svc.app.test_request_context().push()
        db.init_app(self.svc.app)
        # create a sample DB
        db.create_all()
        # create a test client
        self.testapp = self.svc.app.test_client()
        self.testapp.manager = APIManager(self.testapp, flask_sqlalchemy_db=db)
        self.svc.manager.create_api(MyPlace, methods=['GET', 'POST', 'PUT', 'DELETE'])

    def tearDown(self):
        # clean-up DB
        db.drop_all()


    def testDBopsAddGet(self):
        """
        Test database operations
        """
        # load some sample data
        mypoi = MyPlace()
        mypoi.name = "mytestfav"
        mypoi.address = "5100 Commerce Pkwy, Roswell, GA 30076"
        db.session.add(mypoi)
        db.session.commit()
        # now attempt to retrieve it back
        res = (MyPlace.query.filter_by(name="mytestfav")).first()
        assert res.name == "mytestfav"

    def testRESTopsPresence(self):
        """
        Test REST ops
        """
        # load some sample data
        mypoi = MyPlace()
        mypoi.name = "myrestfav"
        mypoi.address = "5100 Commerce Pkwy, Roswell, GA 30076"
        db.session.add(mypoi)
        db.session.commit()

        # there should be no one there indeed
        response = self.testapp.get('/api/noonehere')
        assert response.status_code == 404

        # there should be a valid response
        self.testapp = self.svc.app.test_client()
        response = self.testapp.get('/api/myplace', environ_base={'HTTP_USER_AGENT': 'Chrome'})
        print response.data
        assert response.status_code == 200
if __name__ == "__main__":
    unittest.main()

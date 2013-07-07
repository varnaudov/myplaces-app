'''
@author: varnaudov
'''
from flask_sqlalchemy import SQLAlchemy

# varnaudov TODO: a full-fledged validation framework can be used instead
from sqlalchemy.orm import validates

"""
This class contains our favourite places model
It can be reused in other applications/services, etc. if needed
"""

# Database ref
db = SQLAlchemy()
#

class MyPlaceException(Exception):
    """
    Simple exception for nicely handling validation errors
    """
    pass

class MyPlace(db.Model):
    __tablename__ = 'myplace'
    id = db.Column(db.INTEGER, primary_key=True)
    name = db.Column(db.Unicode(255))
    address = db.Column(db.Unicode(255))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)

    def __repr__(self):
        """
        Get a shortened representation
        """
        return '<MyPlace %r>' % self.name

    @property
    def json(self):
        return dict(id=self.id, name=self.name, address=self.address, latitude=self.latitude, longitude=self.longitude)

    def __str__(self):
        """
        Get a string representation
        """
        return "MyPlace {} at addr {}; lat={} lng={}".format(self.name, self.address, self.latitude, self.longitude)

    @validates('name')
    def validate_name(self, key, thename):
        """
        Validate whether the input has a name defined
        """
        if thename is None or len(thename) == 0:
            raise MyPlaceException('name cannot be null')
        return thename

    @validates('address')
    def validate_address(self, key, thename):
        """
        Validate whether the input has an address defined
        """
        if thename is None or len(thename) == 0:
            raise MyPlaceException('name cannot be null')
        return thename

    '''
    TODO varnaudov: alidate lat/long coordinates too
    '''

from setuptools import setup, find_packages
import sys, os
import multiprocessing

cwd = os.path.abspath(os.path.dirname(__file__))
# README = open(os.path.join(here, 'README.rst')).read()


version = '0.1'

install_requires = [
    # List your project dependencies here.
    # For more details, see:
    # http://packages.python.org/distribute/setuptools.html#declaring-dependencies
]


setup(name='eatpy-services',
    version=version,
    description="the myplace services; consumes model; can start a standalone service if necessar or be embedded in other apps",
    classifiers=[
      # Get strings from http://pypi.python.org/pypi?%3Aaction=list_classifiers
    ],
    keywords='myplace service',
    author='varnaudov',
    author_email='',
    url='',
    license='ls',
    packages=find_packages('src'),
    package_dir={'':'src'},
    namespace_packages=['org', 'org.awesome'],
    test_suite='nose.collector',
    tests_require=['nose'],
    zip_safe=False,
    install_requires=install_requires,
)

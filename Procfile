web: sh -c 'cd ./webapp/ && gunicorn app:frontend'
init: sh -c 'cd ./tools/ && python setup.py install' && sh -c 'cd ./model/ && python setup.py install' && sh -c 'cd ./services/ && python setup.py install'

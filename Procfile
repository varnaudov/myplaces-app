web: sh -c 'cd ./tools/ && python setup.py install' && sh -c 'cd ./model/ && python setup.py install' && sh -c 'cd ./services/ && python setup.py install' && sh -c 'cd ./webapp/ && gunicorn app:frontend'
init: sh -c 'cd ./tools/ && python setup.py install' && sh -c 'cd ./model/ && python setup.py install' && sh -c 'cd ./services/ && python setup.py install'
createdb: sh -c 'cd ./webapp/ && python db_create.py'
recreatedb: sh -c 'cd ./webapp/ && python db_recreate.py'
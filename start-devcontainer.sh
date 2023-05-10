#!/bin/bash -e
docker-compose build plexhooks-dev
docker-compose run --rm --service-ports plexhooks-dev 

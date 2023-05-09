#!/bin/bash -e
docker-compose build website-dev
docker-compose run --rm --service-ports website-dev 

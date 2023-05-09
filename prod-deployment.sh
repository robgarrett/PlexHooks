#!/bin/bash -e
docker-compose build website-prod
docker tag website:prod robgarrett/website:amd64
docker push robgarrett/website:amd64
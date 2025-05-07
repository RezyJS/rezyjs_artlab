#!/bin/sh

DOCKER_HOST=ssh://root@93.123.84.56 docker compose -f docker-compose.yaml up -d --build

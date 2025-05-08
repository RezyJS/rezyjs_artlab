#!/bin/sh

COMPOSE_BAKE=true DOCKER_HOST=ssh://root@93.123.84.239 docker compose -f docker-compose.yaml up -d --build

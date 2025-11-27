#!/usr/bin/env bash
set -euo pipefail

IMAGE=media-mover-bot
PROJECT=media-mover-bot

docker build -t "$IMAGE" .

COMPOSE_PROJECT_NAME=$PROJECT docker compose up -d
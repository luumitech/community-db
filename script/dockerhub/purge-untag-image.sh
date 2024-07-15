#!/bin/bash

#
# WARNING! This will remove:
# - all stopped containers
# - all networks not used by at least one container
# - all dangling images
# - unused build cache

SCRIPT_DIR=$(dirname $0)

# Get environment variables
source ${SCRIPT_DIR}/set-env.sh

(
  set -ex
  docker system prune --force
)

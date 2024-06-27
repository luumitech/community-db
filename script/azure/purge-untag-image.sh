#!/bin/bash

#
# Purge untagged image from docker container registry
#
# For details, see
# See: https://docs.microsoft.com/en-us/azure/container-registry/container-registry-auto-purge
# This script does not work on Windows system

SCRIPT_DIR=$(dirname $0)

# Get environment variables
source ${SCRIPT_DIR}/set-env.sh

# Environment variable for container command line
PURGE_CMD="acr purge --filter '${DOCKER_IMAGE}:.*' \
  --ago 15d \
  --untagged --keep 5"

(
  set -x
  az acr run \
    --cmd "$PURGE_CMD" \
    --subscription ${SUBSCRIPTION} \
    --registry ${CONTAINER_REGISTRY} \
    /dev/null
)

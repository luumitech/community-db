#!/bin/bash

# Build docker image and tag it with a name
usage() {
  echo "Build docker image in docker hub registry"
  echo ""
  echo "Usage: $0 [option]"
  echo "  options:"
  echo "    -t, --tag=<name> : tag name (i.e. dev or prod)"
  echo "    -h               : Show this help"
  echo ""
  exit
}

die() {
  echo "$*" >&2
  exit 2
}

needs_arg() {
  if [ -z "$OPTARG" ]; then
    die "No arg for --$OPT option"
  fi
}

SCRIPT_DIR=$(dirname $0)

# Process command line arguments
OPTIND=1
while getopts "t:-:h" OPT; do
  # support long options: https://stackoverflow.com/a/28466267/519360
  if [ "$OPT" = "-" ]; then # long option: reformulate OPT and OPTARG
    OPT="${OPTARG%%=*}"     # extract long option name
    OPTARG="${OPTARG#$OPT}" # extract long option argument (may be empty)
    OPTARG="${OPTARG#=}"    # if long option argument, remove assigning `=`
  fi
  case "$OPT" in
  t | tag)
    needs_arg
    TAG="${OPTARG}"
    ;;
  ??*) die "Illegal option --$OPT" ;;
  h | \?)
    usage
    exit 0
    ;;
  esac
done
shift $((OPTIND - 1)) # remove parsed options and args from $@ list

if [[ -z "${TAG}" ]]; then
  die "Option --tag must be specified"
fi

# Get app specific environment variables
source ${SCRIPT_DIR}/set-env.sh

#
# Deploy server to azure docker registry
# --registry expects <registry-name>
# --image expects <docker-image-name>
#
APP_VERSION=$(git describe --tags $(git rev-list --tags --max-count=1))
GIT_BRANCH=$(git symbolic-ref --short HEAD)
GIT_COMMIT_HASH=$(git log -n 1 --pretty=format:"%H")
echo "Deploying to Dockerhub container registry - ${CONTAINER_REGISTRY}"
echo "  IMAGE=${DOCKER_IMAGE}:${TAG}"
echo "  APP_VERSION=${APP_VERSION}"
echo "  GIT_BRANCH=${GIT_BRANCH}"
echo "  GIT_COMMIT_HASH=${GIT_COMMIT_HASH}"

(
  set -ex
  docker buildx build \
    --platform linux/amd64 \
    -t ${CONTAINER_REGISTRY}/${DOCKER_IMAGE}:${TAG} \
    --build-arg APP_VERSION=${APP_VERSION} \
    --build-arg GIT_BRANCH=${GIT_BRANCH} \
    --build-arg GIT_COMMIT_HASH=${GIT_COMMIT_HASH} \
    -f docker/Dockerfile .
  docker push ${CONTAINER_REGISTRY}/${DOCKER_IMAGE}:${TAG}
)

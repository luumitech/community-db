#!/bin/bash

# Set environment variables associated with community-db
usage() {
  echo "Set environment variables associated with community-db"
  echo ""
  echo "Usage: $0 [option]"
  echo "  options:"
  echo "    -s, --slot : slot name (i.e. dev, staging or prod)"
  echo "    -h         : Show this help"
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

# Process command line arguments
OPTIND=1
while getopts "s:p-:h" OPT; do
  # support long options: https://stackoverflow.com/a/28466267/519360
  if [ "$OPT" = "-" ]; then # long option: reformulate OPT and OPTARG
    OPT="${OPTARG%%=*}"     # extract long option name
    OPTARG="${OPTARG#$OPT}" # extract long option argument (may be empty)
    OPTARG="${OPTARG#=}"    # if long option argument, remove assigning `=`
  fi
  case "$OPT" in
  s | slot)
    needs_arg
    SLOT="${OPTARG}"
    URL="https://community-db-${SLOT}.azurewebsites.net"
    ;;
  ??*) die "Illegal option --$OPT" ;;
  h | \?)
    usage
    exit 0
    ;;
  esac
done
shift $((OPTIND - 1)) # remove parsed options and args from $@ list

# Name of dockerhub registry
export CONTAINER_REGISTRY="kendrickw"
# Name of docker image
export DOCKER_IMAGE="community-db"

# app service URL
if [[ -n "${URL}" ]]; then
  export APP_URL=${URL}
fi

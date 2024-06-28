# This layer is for building the node server
# without the development dependencies
FROM node:20-alpine AS BUILD_IMAGE

ARG APP_VERSION
ARG GIT_BRANCH
ARG GIT_COMMIT_HASH

WORKDIR /app

# Install native dependencies
RUN apk add --no-cache \
  # - python, make, g++ are for node-gyp
  python3 \
  make \
  g++

# Separate node dependency into its own copy, so it gets cached
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile --network-timeout 100000

# Copy the rest of the source code over, and perform build
COPY . ./

# yarn build uses APP_VERSION to upload source map to Sentry
# These args are used by NextJS build
ENV NEXT_PUBLIC_APP_VERSION=${APP_VERSION} \
    NEXT_PUBLIC_GIT_BRANCH=${GIT_BRANCH} \
    NEXT_PUBLIC_GIT_COMMIT_HASH=${GIT_COMMIT_HASH}

RUN yarn build

# Wipe dev dependencies from node_modules
RUN npm prune --omit-dev

# Stage containing image for running node web server
FROM node:20-alpine

WORKDIR /home/app

# user created for running the server (so it can be run without root priviledge)
ARG USER=luumitech

# Install native dependencies
RUN apk add --no-cache \
  # For SSH into Azure app service
  openssh \
  su-exec

# Setup SSH server
# For details:
#   https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container?tabs=debian&pivots=container-linux#enable-ssh
COPY ./docker/sshd_config /etc/ssh/

# Copy from build image
COPY --from=BUILD_IMAGE /app ./

# Add user to run image as non-root user
RUN addgroup -S mygroup \
  && adduser -S -G mygroup ${USER} \
  && chown -R ${USER}:mygroup ./

# Start and enable SSH, only works if USER is root
RUN echo "root:Docker!" | chpasswd \
    && chmod +x ./docker/entrypoint.sh \
    && cd /etc/ssh/ \
    && ssh-keygen -A

# By default Azure assumes container is listening on port 80,
# But we can't open port 80 as a non-root user, so make sure
# WEBSITES_PORT app setting in Azure is specified.
ENV PORT=3000 \
    USER=${USER}

EXPOSE 3000 2222

CMD ["./docker/entrypoint.sh"]

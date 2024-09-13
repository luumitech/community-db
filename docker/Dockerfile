FROM node:20-alpine AS base

#
# This layer is for node dependencies
#
FROM base AS dep-layer
WORKDIR /app

# Install native dependencies
RUN apk add --no-cache \
  libc6-compat

COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile --network-timeout 100000

#
# This layer is for building production image
#
FROM base AS build-layer
WORKDIR /app

# Copy node dependencies
COPY --from=dep-layer /app/node_modules ./node_modules
# Copy source code over, then perform build
COPY . .

# yarn build uses APP_VERSION to upload source map to Sentry
# These args are used by NextJS build
ARG APP_VERSION
ARG GIT_BRANCH
ARG GIT_COMMIT_HASH
ENV NEXT_PUBLIC_APP_VERSION=${APP_VERSION} \
    NEXT_PUBLIC_GIT_BRANCH=${GIT_BRANCH} \
    NEXT_PUBLIC_GIT_COMMIT_HASH=${GIT_COMMIT_HASH} \
    NEXT_TELEMETRY_DISABLED=1

RUN yarn build

#
# This layer is for running production image
#
FROM base AS run-layer
WORKDIR /app

# Install native dependencies
RUN apk add --no-cache \
  # For SSH into Azure app service
  openssh \
  su-exec

# user/group created for running the server
# (so Node server can be run without root priviledge)
ARG GROUP=nodejs
ARG USER=luumitech
RUN addgroup --system --gid 1001 ${GROUP}
RUN adduser --system --uid 1001 ${USER}

# Copy from build layer
COPY --from=build-layer --chown=${USER}:${GROUP} /app/.next/standalone ./
COPY --from=build-layer --chown=${USER}:${GROUP} /app/docker/entrypoint.sh ./docker/entrypoint.sh

# Setup SSH server
# For details:
#   https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container?tabs=debian&pivots=container-linux#enable-ssh
# The SSH daemon must be started as root user (see entrypoint.sh)
COPY ./docker/sshd_config /etc/ssh/
RUN echo "root:Docker!" | chpasswd \
    && chmod +x ./docker/entrypoint.sh \
    && cd /etc/ssh/ \
    && ssh-keygen -A

# By default Azure assumes container is listening on port 80,
# But we can't open port 80 as a non-root user
ENV PORT=3000 \
    USER=${USER}

EXPOSE 3000 2222

CMD ["./docker/entrypoint.sh"]

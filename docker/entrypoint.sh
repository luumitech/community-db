#!/bin/ash
# Start SSH daemon using configuration in sshd_config
/usr/sbin/sshd
# Start production server with non-root user
# This will allow puppeteer to run in sandbox mode
# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
su-exec ${USER} node server.js

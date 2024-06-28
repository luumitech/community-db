#!/bin/ash
# Start SSH daemon using configuration in sshd_config
/usr/sbin/sshd
# Start production server with non-root user
# This will allow puppeteer to run in sandbox mode
su-exec ${USER} /usr/local/bin/yarn start

#!/bin/bash
# Deploy the app to identicon server 

yarn build

# The place where we exported the static build
# after doing 'yarn build' and 'yarn export'
BUILD=./.next

# The place where we will copy the files
TARGET=identicon.near:/opt/identicon/apps/fedevida

#
# IMPORTANT: 'identicon.near' access MUST be defined in '~/.ssh/config' as: 
#
# Host identicon.near
#   Hostname 38.242.216.233	
#   IdentityFile /home/{my-home-folder}/.ssh/id_rsa
#   User ubuntu
#   Passw: ???
#

# We move the files using rsync to avoid copying already existent files
echo ""
echo "---"
echo "Deploying to: $TARGET"
rsync -arv ./next.config.js  $TARGET/
rsync -arv ./package.json  $TARGET/
rsync -arv ./public/ $TARGET/public/
rsync -arv $BUILD/ $TARGET/.next/
rsync -arv $BUILD/standalone/ $TARGET/

# restart 
ssh -t identicon.near "sudo systemctl restart apps-fedevida & sudo systemctl status apps-fedevida" 

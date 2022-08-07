#!/bin/bash
# Deploy the app to identicon server 

# The place where we exported the static build
# after doing 'yarn build' and 'yarn export'
BUILD=./_static

# The place where we will copy the files
TARGET=identicon.near:/opt/identicon/fedevida

#
# IMPORTANT: 'identicon.near' access MUST be defined in '~/.ssh/config' as: 
#
# Host identicon.near
#   Hostname 38.242.216.233	
#   IdentityFile /home/{my-home-folder}/.ssh/id_rsa
#   User ubuntu
#   Passw: ???
#

# We move the files using rsync to avoid copying already existen files
rsync -arv $BUILD/ $TARGET/

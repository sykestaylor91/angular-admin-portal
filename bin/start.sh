#!/bin/sh
# dpw@seattle.local
# 2016.07.29
#

DIST=`pwd`/webapp
PORT=5001

[ -d $DIST ] && {
    docker run --name nowce-nginx -p $PORT:80 -v $DIST:/usr/share/nginx/html:ro -v `pwd`/bin/nginx.conf:/etc/nginx/nginx.conf:ro -d nginx:alpine
} || {
    echo "error, not in admin folder..."
}


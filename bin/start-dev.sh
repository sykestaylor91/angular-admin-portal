#!/bin/sh
# dpw@seattle.local
# 2016.07.29
#

DIST=`pwd`/dist
PORT=8001
CONF=`pwd`/bin/nginx.conf
CONF=`pwd`/bin/nginx-dev.conf

[ -d $DIST ] && {
    docker run --name nowce-nginx-dev \
        --expose 3001-3002 \
        --expose 13990 \
        -p $PORT:80 \
        -v $DIST:/usr/share/nginx/html:ro \
        -v $CONF:/etc/nginx/nginx.conf:ro \
        -d \
        nginx:alpine
} || {
    echo "error, not in admin folder..."
}


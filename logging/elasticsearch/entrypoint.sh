#!/bin/bash

/usr/share/elasticsearch/bin/wait_elastic.sh &
disown

exec /usr/local/bin/docker-entrypoint.sh

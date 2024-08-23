#!/bin/bash

/usr/local/bin/docker-entrypoint.sh &

ES_PID=$!

echo "Waiting for Elasticsearch to start..."
until curl -s -u elastic:$ELASTIC_PASSWORD http://localhost:9200/_cluster/health | grep -E '"status":"(green|yellow)"' > /dev/null; do
    sleep 1
done

if [ ! -f /usr/share/elasticsearch/config/.initialized ]; then
    echo "Setting up passwords for Elasticsearch built-in users..."
    
    if expect /usr/share/elasticsearch/bin/setup-passwords.exp; then
        echo "Passwords have been set for Elasticsearch built-in users."
        touch /usr/share/elasticsearch/config/.initialized
    else
        echo "Password setup failed. Exiting..."
        exit 1
    fi
else
    echo "Initialization already completed, skipping password setup."
fi

fg %1

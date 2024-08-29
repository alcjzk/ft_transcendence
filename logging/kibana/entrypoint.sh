#!/bin/bash

/usr/share/kibana/wait_kibana.sh &
disown

until curl -s -u kibana_system:$ELASTIC_PASSWORD http://elasticsearch:9200 > /dev/null; do
    echo "Waiting for Elasticsearch to be up and accessible..."
    sleep 5
done

echo "Successfully authenticated with Elasticsearch."

if [ ! -f /usr/share/kibana/config/kibana.keystore ]; then
    echo "Creating Kibana keystore..."
    /usr/share/kibana/bin/kibana-keystore create
fi

if ! /usr/share/kibana/bin/kibana-keystore list | grep -q "elasticsearch.password"; then
    echo "Adding Elasticsearch password to Kibana keystore..."
    echo "$ELASTIC_PASSWORD" | /usr/share/kibana/bin/kibana-keystore add elasticsearch.password --stdin
    echo "Elasticsearch password added to Kibana keystore."
else
    echo "Elasticsearch password already exists in Kibana keystore."
fi

echo "Starting Kibana..."
/usr/local/bin/kibana-docker

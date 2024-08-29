#!/bin/bash

SETUP_COMPLETE_FILE="/tmp/kibana_setup_complete"

wait_for_kibana() {
    echo "Waiting for Kibana to be ready..."
    until curl -s http://localhost:5601/api/status | grep -q '"status":{"overall":{"level":"available"'; do
        sleep 5
    done
    echo "Kibana is ready."
}

index_pattern_exists() {
    local pattern_id="$1"
    curl -s -o /dev/null -w "%{http_code}" "http://localhost:5601/api/saved_objects/index-pattern/$pattern_id" \
         -H "kbn-xsrf: true"
}

create_index_pattern() {
    local response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "http://localhost:5601/api/saved_objects/index-pattern" \
         -H "kbn-xsrf: true" \
         -H "Content-Type: application/json" \
         -d '{"attributes":{"title":"elk-logs-*","timeFieldName":"@timestamp"}}')
    
    if [ "$response" == "200" ]; then
        echo "Index pattern created successfully."
    else
        echo "Failed to create index pattern. HTTP response: $response"
    fi
}

import_dashboard() {
    local response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "http://localhost:5601/api/kibana/dashboards/import" \
         -H "kbn-xsrf: true" \
         -H "Content-Type: application/json" \
         -d @/path/to/your/dashboard_export.json)
    
    if [ "$response" == "200" ]; then
        echo "Dashboard imported successfully."
    else
        echo "Failed to import dashboard. HTTP response: $response"
    fi
}

if [ ! -f "$SETUP_COMPLETE_FILE" ]; then
    wait_for_kibana

    if [ "$(index_pattern_exists 'elk-logs-*')" != "200" ]; then
        create_index_pattern
    else
        echo "Index pattern 'elk-logs-*' already exists."
    fi

    import_dashboard

    touch "$SETUP_COMPLETE_FILE"
    echo "Kibana initialization complete."
else
    echo "Kibana has already been set up. Skipping initialization."
fi

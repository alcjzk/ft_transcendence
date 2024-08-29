#!/bin/bash

SETUP_COMPLETE_FILE="/usr/share/kibana/kibana_setup_complete"

wait_for_kibana() {
    until curl -s -u kibana_system:$KIBANA_PASSWORD http://localhost:5601/kibana/api/status | grep -q '"state":"green"'; do
        echo "Waiting for Kibana to be ready..."
        sleep 5
    done
    echo "Kibana is ready."
}

index_pattern_exists() {
    local pattern_id="$1"
    local response=$(curl -s -u elastic:$ELASTIC_PASSWORD -o /dev/null -w "%{http_code}" \
        "http://localhost:5601/kibana/api/saved_objects/index-pattern/$pattern_id" \
        -H "kbn-xsrf: true")
    echo "$response"
}

create_index_pattern() {
    local response=$(curl -s -u elastic:$ELASTIC_PASSWORD -X POST \
        "http://localhost:5601/kibana/api/saved_objects/index-pattern" \
        -H "kbn-xsrf: true" \
        -H "Content-Type: application/json" \
        -d '{"attributes":{"title":"elk-logs-*","timeFieldName":"@timestamp"}}')
    local status_code=$(echo "$response" | jq -r '.statusCode // empty')
    if [ "$status_code" == "200" ] || [ -z "$status_code" ]; then
        echo "Index pattern created successfully."
    else
        echo "Failed to create index pattern. Response: $response"
    fi
}

import_kibana_objects() {
    local response=$(curl -s -u elastic:$ELASTIC_PASSWORD -X POST \
        "http://localhost:5601/kibana/api/saved_objects/_import?overwrite=true" \
        -H "kbn-xsrf: true" \
        -F "file=@/usr/share/kibana/export.ndjson")
    local success=$(echo "$response" | jq -r '.success')
    if [ "$success" == "true" ]; then
        echo "Kibana objects imported successfully."
    else
        echo "Failed to import Kibana objects. Response: $response"
    fi
}

create_ilm_policy() {
    local response=$(curl -s -u elastic:$ELASTIC_PASSWORD -X PUT \
        "http://elasticsearch:9200/_ilm/policy/elk-logs-retention-policy" \
        -H "Content-Type: application/json" \
        -d '{
            "policy": {
                "phases": {
                    "hot": {
                        "actions": {
                            "rollover": {
                                "max_age": "30d"
                            }
                        }
                    },
                    "delete": {
                        "min_age": "30d",
                        "actions": {
                            "delete": {}
                        }
                    }
                }
            }
        }')
    if echo "$response" | grep -q '"acknowledged":true'; then
        echo "ILM policy created or updated successfully."
    else
        echo "Failed to create or update ILM policy. Response: $response"
    fi
}

apply_ilm_policy_to_index() {
    local response=$(curl -s -u elastic:$ELASTIC_PASSWORD -X PUT \
        "http://elasticsearch:9200/elk-logs-*/_settings" \
        -H "Content-Type: application/json" \
        -d '{
            "index": {
                "lifecycle": {
                    "name": "elk-logs-retention-policy"
                }
            }
        }')
    if echo "$response" | grep -q '"acknowledged":true'; then
        echo "ILM policy applied to index successfully."
    else
        echo "Failed to apply ILM policy to index. Response: $response"
    fi
}

if [ ! -f "$SETUP_COMPLETE_FILE" ]; then
    wait_for_kibana

    import_kibana_objects

    if [ "$(index_pattern_exists 'elk-logs-*')" != "200" ]; then
        create_index_pattern
    else
        echo "Index pattern 'elk-logs-*' already exists."
    fi

    create_ilm_policy
    apply_ilm_policy_to_index

    touch "$SETUP_COMPLETE_FILE"
    echo "Kibana initialization complete."
else
    echo "Kibana has already been set up. Skipping initialization."
fi

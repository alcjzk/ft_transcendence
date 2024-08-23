#!/bin/bash

echo "Waiting for Elasticsearch to start..."
until curl -s -u elastic:$ELASTIC_PASSWORD http://localhost:9200/_cluster/health | grep -E '"status":"(green|yellow)"' > /dev/null; do
    echo "curl failed, retrying"
    sleep 1
done

echo "Elasticsearch is up and running."

if [ ! -f /usr/share/elasticsearch/config/.initialized ]; then
    echo "Setting up passwords for Elasticsearch built-in users..."

    set_password() {
        local user=$1
        local password=$2

        http_status=$(curl -s -o /dev/null -w "%{http_code}" -X POST "http://localhost:9200/_security/user/$user/_password" \
        -u elastic:$ELASTIC_PASSWORD -H "Content-Type: application/json" -d "{\"password\": \"$password\"}")

        if [ "$http_status" -eq 200 ]; then
            echo "Password set successfully for user: $user"
        else
            echo "Failed to set password for user: $user. HTTP status: $http_status"
            exit 1
        fi
    }

    set_password "elastic" "$ELASTIC_PASSWORD"
    set_password "apm_system" "$APM_PASSWORD"
    set_password "kibana_system" "$KIBANA_SYSTEM_PASSWORD"
    set_password "logstash_system" "$LOGSTASH_PASSWORD"
    set_password "beats_system" "$BEATS_PASSWORD"
    set_password "remote_monitoring_user" "$REMOTE_MONITORING_PASSWORD"

    echo "Passwords have been set for Elasticsearch built-in users."
    touch /usr/share/elasticsearch/config/.initialized

    # /usr/share/elasticsearch/bin/setup-passwords.exp
    # EXPECT_EXIT_CODE=$?

    # if [ $EXPECT_EXIT_CODE -eq 0 ]; then
    #     echo "Passwords have been set for Elasticsearch built-in users."
    #     touch /usr/share/elasticsearch/config/.initialized
    # else
    #     echo "Password setup failed with exit code $EXPECT_EXIT_CODE. Exiting..."
    #     kill $ES_PID
    #     exit 1
    # fi
else
    echo "Initialization already completed, skipping password setup."
fi

#!/bin/bash

KIBANA_CONFIG_FILE="/usr/share/kibana/config/kibana.yml"

if grep -q "^elasticsearch\.username:" "$KIBANA_CONFIG_FILE"; then
    echo "elasticsearch.username already set."
else
    echo "Setting elasticsearch.username..."
    echo "elasticsearch.username: \"$KIBANA_SYSTEM_USERNAME\"" >> "$KIBANA_CONFIG_FILE"
fi

if grep -q "^elasticsearch\.password:" "$KIBANA_CONFIG_FILE"; then
    echo "elasticsearch.password already set."
else
    echo "Setting elasticsearch.password..."
    echo "elasticsearch.password: \"$ELASTIC_PASSWORD\"" >> "$KIBANA_CONFIG_FILE"
fi

if grep -q "^xpack\.security\.encryptionKey:" "$KIBANA_CONFIG_FILE"; then
    echo "xpack.security.encryptionKey already set."
else
    echo "Setting xpack.security.encryptionKey..."
    echo "xpack.security.encryptionKey: \"$XPACK_SECURITY_ENCRYPTIONKEY\"" >> "$KIBANA_CONFIG_FILE"
fi

if grep -q "^xpack\.encryptedSavedObjects\.encryptionKey:" "$KIBANA_CONFIG_FILE"; then
    echo "xpack.encryptedSavedObjects.encryptionKey already set."
else
    echo "Setting xpack.encryptedSavedObjects.encryptionKey..."
    echo "xpack.encryptedSavedObjects.encryptionKey: \"$XPACK_ENCRYPTEDSAVEDOBJECTS_ENCRYPTIONKEY\"" >> "$KIBANA_CONFIG_FILE"
fi

if grep -q "^xpack\.reporting\.encryptionKey:" "$KIBANA_CONFIG_FILE"; then
    echo "xpack.reporting.encryptionKey already set."
else
    echo "Setting xpack.reporting.encryptionKey..."
    echo "xpack.reporting.encryptionKey: \"$XPACK_REPORTING_ENCRYPTIONKEY\"" >> "$KIBANA_CONFIG_FILE"
fi

echo "Configuration settings have been applied."

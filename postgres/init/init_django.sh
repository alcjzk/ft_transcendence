#!/bin/sh

psql -v ON_ERROR_STOP=1 --username="$POSTGRES_USER" --dbname="$POSTGRES_DB" << EOF
    CREATE USER django PASSWORD 'django';
    CREATE DATABASE django;
    GRANT ALL PRIVILEGES ON DATABASE django TO django;
    \c django postgres
    GRANT ALL ON SCHEMA public TO django;
EOF

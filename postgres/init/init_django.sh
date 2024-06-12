#!/bin/sh

psql -v ON_ERROR_STOP=1 --username="$POSTGRES_USER" --dbname="$POSTGRES_DB" << EOF
    CREATE USER $DB_DJANGO_USER PASSWORD '$DB_DJANGO_PASSWORD';
    CREATE DATABASE django;
    GRANT ALL PRIVILEGES ON DATABASE django TO $DB_DJANGO_USER;
    \c django postgres
    GRANT ALL ON SCHEMA public TO $DB_DJANGO_USER;
EOF

FROM postgres:16.3-alpine3.19

EXPOSE 5432

USER postgres

RUN mkdir -p /docker-entrypoint-initdb.d/
COPY init/* /docker-entrypoint-initdb.d/


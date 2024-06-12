FROM alpine:3.20.0

RUN apk add --no-cache wget \
    && wget https://dl.grafana.com/oss/release/grafana-11.0.0.linux-amd64.tar.gz \
    && tar -zxvf grafana-11.0.0.linux-amd64.tar.gz \
    && mv grafana-v11.0.0 /grafana \
    && rm grafana-11.0.0.linux-amd64.tar.gz

COPY ./monitoring/grafana/provisioning /grafana/conf/provisioning
COPY ./monitoring/grafana/dashboards /var/lib/grafana/dashboards
COPY ./monitoring/grafana/grafana.ini /grafana/conf/

EXPOSE 3000

CMD ["/grafana/bin/grafana-server", "--homepath=/grafana"]

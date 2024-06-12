FROM alpine:latest

RUN apk add --no-cache wget \
    && wget https://dl.grafana.com/oss/release/grafana-11.0.0.linux-amd64.tar.gz \
    && tar -zxvf grafana-11.0.0.linux-amd64.tar.gz \
    && mv grafana-v11.0.0 /grafana \
    && rm grafana-11.0.0.linux-amd64.tar.gz

COPY ./monitoring/grafana/provisioning /grafana/conf/provisioning
COPY ./monitoring/grafana/dashboards /var/lib/grafana/dashboards

EXPOSE 3000

CMD ["/grafana/bin/grafana-server", "--homepath=/grafana"]

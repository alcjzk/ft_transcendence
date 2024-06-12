FROM alpine:latest

RUN apk add --no-cache wget tar

RUN wget https://github.com/prometheus/prometheus/releases/download/v2.53.0-rc.1/prometheus-2.53.0-rc.1.linux-amd64.tar.gz \
    && tar -xvf prometheus-2.53.0-rc.1.linux-amd64.tar.gz \
    && mv prometheus-2.53.0-rc.1.linux-amd64 /prometheus \
    && rm prometheus-2.53.0-rc.1.linux-amd64.tar.gz

COPY ./monitoring/prometheus/prometheus.yml /etc/prometheus/prometheus.yml
COPY ./monitoring/alertmanager/alerts.yml /etc/prometheus/alerts.yml

RUN chmod +x /prometheus/prometheus
RUN ls -l /prometheus

EXPOSE 9090

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 CMD wget --spider --quiet http://localhost:9090/-/healthy || exit 1

CMD ["/prometheus/prometheus", "--config.file=/etc/prometheus/prometheus.yml", "--storage.tsdb.retention.time=30d"]

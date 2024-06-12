FROM alpine:3.20.0

RUN apk add --no-cache wget \
    && wget https://github.com/prometheus/alertmanager/releases/download/v0.27.0/alertmanager-0.27.0.linux-amd64.tar.gz \
    && tar -xvf alertmanager-0.27.0.linux-amd64.tar.gz \
    && mv alertmanager-0.27.0.linux-amd64 /alertmanager \
    && rm alertmanager-0.27.0.linux-amd64.tar.gz

COPY ./monitoring/alertmanager/alertmanager.yml /etc/alertmanager/alertmanager.yml
COPY ./monitoring/alertmanager/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 9093

CMD ["/entrypoint.sh"]

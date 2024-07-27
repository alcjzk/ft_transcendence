FROM docker.elastic.co/kibana/kibana:7.17.22

COPY kibana.yml /kibana/config/kibana.yml

USER root
RUN mkdir -p /kibanalog && \
    chown -R kibana:kibana /kibanalog && \
    chmod -R 755 /kibanalog

USER kibana
ENTRYPOINT ["/usr/local/bin/kibana-docker"]

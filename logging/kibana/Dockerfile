FROM docker.elastic.co/kibana/kibana:7.17.22

ARG KIBANA_SYSTEM_USERNAME
ARG ELASTIC_PASSWORD
ARG XPACK_SECURITY_ENCRYPTIONKEY
ARG XPACK_ENCRYPTEDSAVEDOBJECTS_ENCRYPTIONKEY
ARG XPACK_REPORTING_ENCRYPTIONKEY

ENV KIBANA_SYSTEM_USERNAME=$KIBANA_SYSTEM_USERNAME
ENV ELASTIC_PASSWORD=$ELASTIC_PASSWORD
ENV XPACK_SECURITY_ENCRYPTIONKEY=$XPACK_SECURITY_ENCRYPTIONKEY
ENV XPACK_ENCRYPTEDSAVEDOBJECTS_ENCRYPTIONKEY=$XPACK_ENCRYPTEDSAVEDOBJECTS_ENCRYPTIONKEY
ENV XPACK_REPORTING_ENCRYPTIONKEY=$XPACK_REPORTING_ENCRYPTIONKEY

COPY kibana.yml /kibana/config/kibana.yml
COPY kibana.yml /usr/share/kibana/config/kibana.yml

USER root

RUN mkdir -p /kibanalog && \
    chown -R kibana:kibana /kibanalog && \
    chmod -R 755 /kibanalog

COPY entrypoint.sh /usr/share/kibana/entrypoint.sh
RUN chmod +x /usr/share/kibana/entrypoint.sh
COPY setup-config.sh /usr/share/kibana/setup-config.sh
RUN chmod +x /usr/share/kibana/setup-config.sh
RUN /usr/share/kibana/setup-config.sh

USER kibana

CMD ["/usr/share/kibana/entrypoint.sh"]

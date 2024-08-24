FROM docker.elastic.co/beats/filebeat:7.17.22

COPY filebeat.yml /usr/share/filebeat/filebeat.yml

USER root
RUN chown root:filebeat /usr/share/filebeat/filebeat.yml \
    && chmod 644 /usr/share/filebeat/filebeat.yml

RUN mkdir -p /var/log/filebeat \
    && chown -R root:filebeat /var/log/filebeat \
    && chmod -R 755 /var/log/filebeat

# USER filebeat

ENTRYPOINT ["filebeat"]

CMD ["-e", "-c", "/usr/share/filebeat/filebeat.yml"]

FROM docker.elastic.co/elasticsearch/elasticsearch:7.17.22

COPY elasticsearch.yml /usr/share/elasticsearch/config/elasticsearch.yml
COPY entrypoint.sh /usr/share/elasticsearch/bin/entrypoint.sh
COPY wait_elastic.sh /usr/share/elasticsearch/bin/wait_elastic.sh
RUN chmod +x /usr/share/elasticsearch/bin/entrypoint.sh
RUN chmod +x /usr/share/elasticsearch/bin/wait_elastic.sh

ENTRYPOINT ["/usr/share/elasticsearch/bin/entrypoint.sh"]

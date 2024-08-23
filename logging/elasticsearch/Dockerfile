FROM docker.elastic.co/elasticsearch/elasticsearch:7.17.22

RUN apt-get update && apt-get install -y expect

COPY elasticsearch.yml /usr/share/elasticsearch/config/elasticsearch.yml

COPY entrypoint.sh /usr/share/elasticsearch/bin/entrypoint.sh
COPY setup-passwords.exp /usr/share/elasticsearch/bin/setup-passwords.exp
RUN chmod +x /usr/share/elasticsearch/bin/entrypoint.sh
RUN chmod +x /usr/share/elasticsearch/bin/setup-passwords.exp

CMD ["/usr/share/elasticsearch/bin/entrypoint.sh"]

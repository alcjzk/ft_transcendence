FROM python:alpine3.19

EXPOSE 8010
WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

ENV USE_POSTGRES="1"

ENTRYPOINT ["sh", "entrypoint.sh"]

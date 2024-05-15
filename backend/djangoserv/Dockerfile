FROM python:alpine3.19

EXPOSE 8010
WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

RUN [ "python", "manage.py", "migrate" ]

CMD [ "python", "manage.py", "runserver", "0.0.0.0:8010" ]

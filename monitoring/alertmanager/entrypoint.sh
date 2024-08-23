#!/bin/sh

sed -i "s/__SMTP_PASSWORD__/${SMTP_PASSWORD}/" /etc/alertmanager/alertmanager.yml
sed -i "s/__SMTP_SENDER__/${SMTP_SENDER}/" /etc/alertmanager/alertmanager.yml
sed -i "s/__SMTP_RECEIVER__/${SMTP_RECEIVER}/" /etc/alertmanager/alertmanager.yml
sed -i "s/__SMTP_HOST__/${SMTP_HOST}/" /etc/alertmanager/alertmanager.yml

exec /alertmanager/alertmanager --config.file=/etc/alertmanager/alertmanager.yml

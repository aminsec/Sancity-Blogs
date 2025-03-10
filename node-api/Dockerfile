FROM ubuntu:latest

MAINTAINER Mohammad Amin Choopani (aminsec)

WORKDIR /var/www/html/api

COPY . .

SHELL ["/bin/bash", "-c"]

RUN apt update && apt upgrade -y && \
    apt install -y curl build-essential mysql-server && \
    apt install nginx -y && \
    service nginx start && \   
    rm /etc/nginx/sites-enabled/default && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt install -y nodejs && \
    npm install -g nodemon && \
    npm install && \
    service mysql start && \
    mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'mmdamins';" && \
    mysql -u root --password=mmdamins -e "create database sancity" && \
    mysql -u root --password=mmdamins sancity < db.sql

COPY default /etc/nginx/sites-available/
COPY default /etc/nginx/sites-enabled/

CMD ["bash", "-c", "service mysql start && service nginx start && node --env-file=src/config/app.env src/index.js"]


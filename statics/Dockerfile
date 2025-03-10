From ubuntu:latest

WORKDIR /app

RUN apt update && apt upgrade -y && \
	apt install nginx -y && \
	rm -rf /etc/nginx/sites-available/default && \
        rm -rf /etc/nginx/sites-enabled/default 

COPY . /var/www/html/
COPY default /etc/nginx/sites-available

RUN ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/

CMD service nginx start && tail -f /dev/null


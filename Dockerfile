FROM nginx:latest
#FROM --platform=linux/amd64 nginx:latest
COPY ./dist /usr/share/nginx/html/
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html/
#RUN chmod -R 777 som-ar-gui/browser/assets
#RUN chmod -R 777 som-ar-gui/browser/uploads





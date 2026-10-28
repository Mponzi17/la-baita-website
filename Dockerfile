# La Baita Lounge landing page: static site on nginx.
# Cloud Run: deploy as-is (listens on 8080).
# VPS: docker build -t labaita . && docker run -d -p 80:8080 --restart unless-stopped labaita
FROM nginx:1.27-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/site.conf
COPY index.html /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
EXPOSE 8080

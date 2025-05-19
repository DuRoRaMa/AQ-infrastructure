FROM node as development
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build-only

FROM nginx:stable-alpine as production
COPY --from=development /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY pavlyuk-it.ru.* /etc/nginx/ssl/
CMD ["nginx", "-g", "daemon off;"]


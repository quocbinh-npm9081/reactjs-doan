FROM node:16 as build
WORKDIR /usr/src/app
COPY . .
ARG env=dev
RUN npm install
RUN npm run build:$env

FROM nginx:stable-alpine
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

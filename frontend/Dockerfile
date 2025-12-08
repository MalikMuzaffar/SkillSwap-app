FROM node:latest AS build

WORKDIR /FYP

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# stage 2

FROM nginx:latest

COPY --from=build /FYP/dist usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
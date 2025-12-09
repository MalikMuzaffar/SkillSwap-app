FROM node:latest AS build

WORKDIR /FYP

COPY package*.json ./

RUN npm install

COPY . .

ARG VITE_BACKEND_URI
ARG VITE_SOCKET_URI

ENV VITE_BACKEND_URI=$VITE_BACKEND_URI
ENV VITE_SOCKET_URI=$VITE_SOCKET_URI

RUN npm run build

# stage 2

FROM nginx:latest

COPY --from=build /FYP/dist usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
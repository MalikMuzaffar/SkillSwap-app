FROM node:latest AS build

WORKDIR /FYP

COPY package*.json ./

RUN npm install

COPY . .

# Pass build args with defaults
ARG VITE_BACKEND_URI=/api
ARG VITE_SOCKET_URI=/socket.io

ENV VITE_BACKEND_URI=$VITE_BACKEND_URI
ENV VITE_SOCKET_URI=$VITE_SOCKET_URI

RUN npm run build

# stage 2
FROM nginx:latest

# Fixed leading slash /usr/share/nginx/html
COPY --from=build /FYP/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
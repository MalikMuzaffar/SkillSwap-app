FROM node:18-alpine AS build

WORKDIR /FYP

COPY package*.json ./

RUN npm install

COPY . .

ARG VITE_BACKEND_URI=/api
ARG VITE_SOCKET_URI=/socket.io

ENV VITE_BACKEND_URI=$VITE_BACKEND_URI
ENV VITE_SOCKET_URI=$VITE_SOCKET_URI

RUN npm run build

# Stage 2
FROM nginx:alpine

COPY --from=build /FYP/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
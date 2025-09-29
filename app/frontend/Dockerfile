FROM node:20.19.4-alpine AS build
WORKDIR /opt/frontend/

ARG VITE_SMARTWALK_API_ORIGIN
ENV VITE_SMARTWALK_API_ORIGIN=${VITE_SMARTWALK_API_ORIGIN}

ARG VITE_NOMINATIM_API_ORIGIN
ENV VITE_NOMINATIM_API_ORIGIN=${VITE_NOMINATIM_API_ORIGIN}

ARG VITE_PROJ_OSRM_API_ORIGIN
ENV VITE_PROJ_OSRM_API_ORIGIN=${VITE_PROJ_OSRM_API_ORIGIN}

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY babel.config.js ./
COPY index.html ./
COPY vite.config.ts ./
COPY ./src/ ./src/
COPY ./public/ ./public/
RUN npm run build

FROM nginx:1.29.1-alpine
WORKDIR /etc/nginx/

COPY ./config/nginx/default.conf ./conf.d/default.conf
COPY --from=build /opt/frontend/dist/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

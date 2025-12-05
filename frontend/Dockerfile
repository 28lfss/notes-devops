FROM node:18-alpine AS builder

WORKDIR /app

ARG VITE_FRONTEND_PREFIX=/
ARG VITE_API_URL=/api

ENV VITE_FRONTEND_PREFIX=${VITE_FRONTEND_PREFIX}
ENV VITE_API_URL=${VITE_API_URL}

COPY package*.json ./
RUN npm install

COPY tsconfig.json tsconfig.node.json vite.config.ts tailwind.config.js postcss.config.js ./
COPY index.html ./
COPY src ./src

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

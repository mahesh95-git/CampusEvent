FROM node:22-alpine AS builder

WORKDIR /app


COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
ENV VITE_API_BASE_URL=/api

RUN npm run build



FROM nginx:alpine AS production


RUN rm -rf /usr/share/nginx/html/*



COPY --from=builder /app/dist /usr/share/nginx/html

COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

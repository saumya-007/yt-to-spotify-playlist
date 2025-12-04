# ---------------------------------------------------------
# 1. Build Stage
# ---------------------------------------------------------
FROM node:16-slim AS build
# As i am using a cloud based db the SSL verification can not be done on a aline based image

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# ---------------------------------------------------------
# 2. Runtime Stage
# ---------------------------------------------------------
FROM node:16-slim AS production

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app ./


EXPOSE 4040

CMD ["npm", "start"]
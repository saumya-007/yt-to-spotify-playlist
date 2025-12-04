# -----------------
# BUILD STAGE
# ------------------

FROM node:20 AS build
# AS build is just given a name to the stage and we are basically telling docker that start a new stage with the given name

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# -----------------
# RUNTIME STAGE
# ------------------

FROM nginx:stable-alpine AS production

# This needs to be done because of my systems limitataions
# overwrite default nginx config (this is critical)
# Remove the worker tuning script (critical)
RUN rm -f /docker-entrypoint.d/30-tune-worker-processes.sh

# Remove the default config folder
RUN rm -rf /etc/nginx/conf.d

# Create a minimal stub for default.conf to prevent entrypoint warnings
RUN mkdir -p /etc/nginx/conf.d && echo "# Stub file" > /etc/nginx/conf.d/default.conf

# Your custom nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

# We are using the reference of the stage BUILD that we created earlier
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

# This is a really important line, by defailt nginx works like so
# By default, Nginx runs as a daemon (in background) Parent process exits and Nginx forks and runs detached
# When we write the following it forces Nginx to run in the foreground so the container remains alive
CMD ["nginx", "-g", "daemon off;"]

# Additionally RUN executes at build time.
# CMD runs when the container starts.
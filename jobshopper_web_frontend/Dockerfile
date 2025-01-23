# Stage 1: Build Stage
FROM node:22-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production Stage
FROM nginx:stable-alpine AS production

# Set the working directory
WORKDIR /usr/share/nginx/html

# Copy the built files from the build stage
COPY --from=build /app/dist .

# Copy custom NGINX configuration (optional, if you want to use a custom config)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the HTTP port
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]


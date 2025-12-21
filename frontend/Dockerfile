# frontend/Dockerfile

# --- Stage 1: Build the React App ---
FROM node:18-alpine as build

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine

# Copy the build output from the previous stage to Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a custom Nginx config (we will create this next)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
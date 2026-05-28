FROM nginx:1.25-alpine

# Remove default configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom secure Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static assets to Nginx default html directory
COPY . /usr/share/nginx/html

# Adjust permissions to ensure nginx user can read the files
RUN chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

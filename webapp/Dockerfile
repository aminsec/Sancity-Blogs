FROM ubuntu:latest

WORKDIR /app

# Install dependencies
RUN apt update && \
    apt upgrade -y && \
    apt install curl -y

# Install Node.js and npm (using Node.js 22.x)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt install -y nodejs

# Install global packages
RUN npm install -g serve

# Copy application code
COPY . .

# Install project dependencies
RUN npm install --legacy-peer-deps

# Set legacy OpenSSL provider for compatibility
ENV NODE_OPTIONS=--openssl-legacy-provider

# Build the application
RUN npm run build

# Expose port 80
EXPOSE 80

# Command to serve the built app
CMD ["serve", "-s", "build", "-p", "80"]


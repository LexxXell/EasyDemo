# Use the official Node.js 20.11.0 image
FROM node:20.11.0

# Set the working directory in the container
WORKDIR /app

# Copy the rest of the application
COPY . .

RUN rm -rf node_modules dist

# Install dependencies
RUN npm install

# Build the application
RUN npm run prod-build

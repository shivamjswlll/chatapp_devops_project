# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose backend port
EXPOSE 5173

# Start the server
CMD ["npm", "run", "dev"]

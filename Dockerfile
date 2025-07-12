FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy application files
COPY server.js ./
COPY public/ ./public/

# Create directory for data files
RUN mkdir -p /app

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
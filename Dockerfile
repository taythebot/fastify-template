FROM node:14-alpine

# Set user
USER node

# Create app directory
WORKDIR /app

# Copy package.son
COPY package*.json ./

# Install modules
RUN npm install -only=prod

# Copy files
COPY . .

# Expose port
EXPOSE 3000

CMD ["npm", "run", "start"]



FROM node:14-alpine

# Set user
USER node

# Copy package.json and yarn.lock
COPY package.json ./
COPY yarn.lock ./

# Install modules
RUN npm install -only=prod

# Copy files
COPY . .

# Expose port
EXPOSE 3000

CMD ["npm", "run", "start"]
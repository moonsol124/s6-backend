# Use Node.js official image as a base
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app's code
COPY . .

# Expose port 8080 for the app
EXPOSE 3000

# Run the app
CMD ["node", "app.js"]

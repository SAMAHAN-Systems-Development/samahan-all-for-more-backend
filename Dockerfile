# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install --save @types/multer

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN npx prisma generate
RUN npm run build

# Expose the application port
EXPOSE 8000

# Command to run the application
CMD ["node", "dist/src/main"]
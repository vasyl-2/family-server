# Use the official Node.js image as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./
COPY node_modules ./node_modules
COPY dist ./dist
# Install dependencies
#RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

#RUN npm prune --omit=dev --force

# Build the application
RUN npm run build

# Expose the port that your application runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main.js"]

FROM node:18-alpine

# Create app directory
WORKDIR /app

# Installing dependency
COPY package.json .

RUN npm install

# Copying source files
COPY . .

# Building app
RUN npm run build

# Application server port
EXPOSE 3000

# Running the app
CMD ["npm", "start"]
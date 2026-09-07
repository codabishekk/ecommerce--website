#use the offical node.js image
FROM node:20

#set the working directory
WORKDIR /usr/src/backend

COPY package.json ./
COPY package-lock.json ./

#install dependencies
RUN npm install

#copy the rest of the application code
COPY . .

#Expose the port the app runs on
EXPOSE 5000

#command to run the app
CMD ["npm", "start"]
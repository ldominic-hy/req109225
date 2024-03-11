FROM node:lts-alpine
ENV NODE_ENV=production
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# COPY package*.json ./
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

# RUN npm install --silent
RUN npm install --production --silent && mv node_modules ../
# Copy app source code
COPY . .

#Expose port and start application
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]

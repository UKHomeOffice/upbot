FROM node:7.4
MAINTAINER Tom Fitzherbert <tom.fitzherbert@digital.homeoffice.gov.uk>

# Create app directory
RUN mkdir -p /usr/src/upbot
WORKDIR /usr/src/upbot

# Bundle app source
COPY . /usr/src/upbot
RUN npm install --quiet

# weird dockerlint error here :(
CMD [ "npm", "start"]


# build with the following command:
# docker build -t tomfitzherbert/upbot:0.0.1 .
# and run it with:
# docker run -t -i tomfitzherbert/upbot:0.0.1

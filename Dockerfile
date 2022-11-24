FROM node:14-alpine


ARG build_arg="-"

#Environment
ENV LOGGER_LEVEL=info
ENV BUILD=$build_arg
WORKDIR /app

#Optimize building time. Cache npm install on this layer so that it is cached between code updates.
ADD src/package.json /app
RUN npm install

ADD src/ /app
#RUN npm install

VOLUME [ "/mnt" ]

EXPOSE 8000
CMD ["npm", "start"]


FROM node:20.12-alpine

WORKDIR /app
COPY . .

ARG APP_PORT

EXPOSE ${APP_PORT}

RUN ["npm", "i"]
CMD ["npm", "run", "start"]
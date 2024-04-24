FROM node:20.12-alpine

WORKDIR /app
COPY . .

ARG APP_PORT
ARG DATABASE_URL

EXPOSE ${APP_PORT}

RUN ["npm", "i"]
CMD ["npm", "run", "start"]
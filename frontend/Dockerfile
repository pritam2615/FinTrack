FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

COPY --chown=node:node .env.docker .env

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

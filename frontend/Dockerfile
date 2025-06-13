FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN ls -la
COPY /.env.docker .env

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

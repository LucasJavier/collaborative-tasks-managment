FROM node:20-alpine as builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

COPY .env .env.local ./

RUN npx prisma generate

RUN npm run build

RUN npm prune --production

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
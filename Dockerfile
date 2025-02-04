    FROM node:20-alpine as builder

    WORKDIR /app

    COPY package.json package-lock.json ./
    COPY prisma ./prisma

    RUN npm install

    COPY . .

    RUN npx prisma generate

    RUN npm run build

    RUN npm prune --production 

    ENV NODE_ENV=production

    EXPOSE 3000

    CMD ["npm", "start"]
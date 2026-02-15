FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci        
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
COPY tsconfig.json ./
COPY src ./src

RUN npx prisma generate
RUN npm run build


FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts

EXPOSE 5001
CMD ["npm", "run", "start"]

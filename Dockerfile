# syntax=docker/dockerfile:1

# 1단계: 의존성 설치
FROM node:18-alpine AS deps

RUN apk add --no-cache libc6-compat
RUN corepack enable

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 2단계: 앱 빌드
FROM node:18-alpine AS builder

RUN apk add --no-cache libc6-compat
RUN corepack enable

WORKDIR /app

# 의존성 복사
COPY --from=deps /app/node_modules ./node_modules

# 소스 복사
COPY . .

# 환경 변수 복사
COPY .env.production ./

# Next.js 빌드
RUN yarn build
RUN rm -rf ./.next/cache

# 3단계: 런타임
FROM node:18-alpine AS runner

RUN apk add --no-cache libc6-compat

WORKDIR /app
ENV NODE_ENV=production

# 앱 복사
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env.production ./.env.production

EXPOSE 3000

CMD ["yarn", "start"]

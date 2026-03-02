ARG NODE_VERSION=22.21.0
ARG NGINX_VERSION=1.27.4
ARG TURBO_VERSION=2.6.1

# 1. Alpine image
FROM node:${NODE_VERSION}-alpine AS alpine
RUN apk update
RUN apk add --no-cache libc6-compat

# Setup pnpm and turbo on the alpine base
FROM alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true

RUN npm install -g corepack@latest
RUN corepack enable
RUN npm install turbo@${TURBO_VERSION} --global
# RUN npm install pnpm turbo --global
RUN pnpm config set store-dir ~/.pnpm-store


# 2. Prune projects
FROM base AS pruner
ARG PROJECT

WORKDIR /app
COPY . .
RUN turbo prune ${PROJECT} --docker


# 3. Build the project
FROM base AS builder
ARG PROJECT

ARG VITE_ROLLBAR_API_TOKEN

ENV VITE_ROLLBAR_API_TOKEN=$VITE_ROLLBAR_API_TOKEN

WORKDIR /app

# Copy lockfile and package.json's of isolated subworkspace
# COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
# COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

# First install the dependencies (as they change less often)
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm install --frozen-lockfile

# Copy source code of isolated subworkspace
COPY --from=pruner /app/out/full/ .

# Build project, create dist filder
RUN turbo build --filter=${PROJECT}

# prune --prod for some reason doesn't work, see https://github.com/pnpm/pnpm/issues/8307
# RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store CI=true pnpm prune --prod --no-optional
# Remove source code
RUN rm -rf ./apps/${PROJECT}/src


# 4.1. Final image for backend
FROM alpine AS backend
ARG PROJECT

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

WORKDIR /app
COPY --from=builder --chown=nodejs:nodejs /app .

WORKDIR /app/apps/${PROJECT}

RUN mkdir -p public/m

ARG PORT=8000
ENV PORT=${PORT}
ENV NODE_ENV=production
EXPOSE ${PORT}


CMD node dist/index.js

# 4.2. Final image for frontend
FROM nginx:${NGINX_VERSION}-alpine AS frontend
ARG PROJECT

ARG VITE_API_SERVER

ENV VITE_API_SERVER=$VITE_API_SERVER

WORKDIR /usr/share/nginx/

RUN rm -rf html
RUN mkdir html

WORKDIR /

COPY --from=builder /app/apps/${PROJECT}/dist /usr/share/nginx/html
COPY --from=builder /app/apps/${PROJECT}/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]

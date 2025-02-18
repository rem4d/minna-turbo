FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g corepack@latest
RUN corepack enable
RUN npm install -g turbo@2.3.3

FROM base AS builder
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN turbo build --filter=client-front --filter=client-backend
RUN pnpm deploy --filter=client-front --prod /prod/client-front
RUN pnpm deploy --filter=client-backend --prod /prod/client-backend


FROM nginx:1.27.4-alpine AS front
WORKDIR /usr/share/nginx/

RUN rm -rf html
RUN mkdir html

WORKDIR /
COPY --from=builder /prod/client-front/dist /usr/share/nginx/html
COPY --from=builder /prod/client-front/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]


FROM base AS back
COPY --from=builder /prod/client-backend /app/client-backend
WORKDIR /app/client-backend

EXPOSE 8000

CMD [ "pnpm", "start" ]

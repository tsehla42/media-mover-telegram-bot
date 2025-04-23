# syntax=docker/dockerfile:1

# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /usr/src/app

# Step 1: Use bind+cache to install dependencies quickly, then copy actual files
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev && \
    cp package*.json . # Copy them into the image so later layers can access them

# Step 2: Copy the rest of the project and compile
COPY tsconfig.json ./
COPY src ./src

# Compile TypeScript to JS
RUN npm run compile

###
### Runtime Stage
###
FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy only what's needed for runtime
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Run the application as a non-root user.
USER node
# Expose the port that the application listens on.
EXPOSE 3000
# Run the application.
CMD ["npm", "run", "bot"]
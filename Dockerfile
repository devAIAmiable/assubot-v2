# Multi-stage build for React/TypeScript application
FROM node:18-alpine AS base

ARG VITE_CORE_API_URL
ARG VITE_APP_NAME
ARG VITE_APP_VERSION
ARG VITE_APP_ENV

ENV VITE_CORE_API_URL=${VITE_CORE_API_URL}
ENV VITE_APP_NAME=${VITE_APP_NAME}
ENV VITE_APP_VERSION=${VITE_APP_VERSION}
ENV VITE_APP_ENV=${VITE_APP_ENV}

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Development stage
FROM base AS development
COPY . .
EXPOSE 5173
CMD ["pnpm", "dev", "--host", "0.0.0.0"]

# Build stage
FROM base AS build
COPY . .
RUN pnpm build

# Production stage - serve with Node.js
FROM node:18-alpine AS production

# Install serve for static file serving
RUN npm install -g serve

# Copy built assets from build stage
COPY --from=build /app/dist /app/dist

# Set working directory
WORKDIR /app

# Expose port (Railway will set the PORT environment variable)
EXPOSE 5173

# Start the server - use PORT env var or default to 5173
CMD ["sh", "-c", "serve -s dist -l ${PORT:-5173}"]

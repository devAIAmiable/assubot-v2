# Multi-stage build for React/TypeScript application
FROM node:18-alpine AS base

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

# Expose port 3000
EXPOSE 3000

# Start the server
CMD ["serve", "-s", "dist", "-l", "3000"]

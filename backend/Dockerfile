# --- Stage 1: Build and dependency installation ---
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy dependency configuration
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# --- Stage 2: Runtime image ---
FROM node:20-alpine

WORKDIR /usr/src/app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Copy node_modules from builder
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copy app source code
COPY src/ ./src/

# Change ownership of the app files to the non-root user 'node'
RUN chown -R node:node /usr/src/app

# Run containers under a non-root user
USER node

# Expose port
EXPOSE 3000

# Healthcheck configuration (essential for container monitoring in DevSecOps)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/api/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# CMD instruction
CMD ["node", "src/index.js"]

# Use Debian-based Node image for native module compatibility (e.g., lightningcss)
FROM node:18-bullseye-slim

# Set working directory
WORKDIR /app

# Copy package and lock files first for better caching
COPY package.json package-lock.json ./

# Install dependencies (only production if you're building for prod)
RUN npm i

# Copy the rest of the source code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the default port used by Next.js
EXPOSE 3000

# Use Next.js built-in production server
CMD ["npm", "start"]

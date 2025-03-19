FROM node:22-alpine

# Install necessary tools (bash for debugging, if needed)
RUN apk add --no-cache bash

# Create app directory
WORKDIR /usr/src/app

# Copy root package.json and lock file first
COPY package*.json ./

# Copy package.json files from apps (admin and web)
COPY apps/admin/package.json ./apps/admin/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY apps/backend/package.json ./apps/backend/package.json

# Install app dependencies using root package.json (will install Turbo and all dependencies)
RUN npm install

# Copy the rest of the app source code
COPY . .

# Generate Prisma database client if Prisma is used (uncomment if needed)
# RUN npx prisma generate

# Build the app using Turborepo
RUN npm run build

# Expose the port (default: 50500)
EXPOSE 3000
EXPOSE 3004
EXPOSE 3004

# Declaring environment variables
ARG PORT=50500
ENV NODE_ENV=production
ENV DATABASE_URL=
ENV REDIS_URL=
ENV MONGODB_URL=
ENV PORT=${PORT}
ENV SPACES_BASE_URl=
ENV ACCESS_TOKEN_LIFETIME=
ENV ENDPOINT=
ENV SPACES_KEY=
ENV SPACES_SECRET=
ENV REGION=
ENV BUCKET_NAME=

# Start the app using the Turbo run command
CMD ["npm", "run", "start"]

FROM node:22-alpine

# Install necessary tools (bash for debugging, if needed)
RUN apk add --no-cache bash

# Create app directory
WORKDIR /usr/src/app

# Copy root package.json and lock file first
COPY package*.json ./

# Copy package.json files from apps (admin and web)
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/admin/package.json ./apps/admin/package.json
COPY apps/web/package.json ./apps/web/package.json

# Install app dependencies using root package.json (will install Turbo and all dependencies)
RUN npm install

# Copy the rest of the app source code
COPY . .
COPY apps/backend/.env ./apps/backend/.env


# Run Prisma migrations
# RUN set -a && . ./apps/backend/.env && npx prisma migrate deploy --schema ./apps/backend/prisma/schema.prisma
RUN . ./apps/backend/.env npx prisma migrate deploy --schema ./apps/backend/prisma/schema.prisma

# Generate Prisma client (ensure .env is loaded)
# RUN set -a && . ./apps/backend/.env && npx prisma generate --schema ./apps/backend/prisma/schema.prisma
RUN npx prisma generate --schema ./apps/backend/prisma/schema.prisma


# Build the app using Turborepo
RUN npm run build

# Expose the port (default: 50500)
EXPOSE 3004  
EXPOSE 3025
EXPOSE 3011

# Declaring environment variables
# ARG PORT=
# ENV PORT=
# ENV DATABASE_URL=
# ENV NODE_ENV=
# ENV REDIS_URL=
# ENV MONGODB_URL=
# ENV SPACES_BASE_URl=
# ENV ACCESS_TOKEN_LIFETIME=
# ENV ENDPOINT=
# ENV SPACES_KEY=
# ENV SPACES_SECRET=
# ENV REGION=
# ENV BUCKET_NAME=

# Start the app using the Turbo run command
CMD ["npm", "run", "start"]

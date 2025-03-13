FROM node:22-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install


# Declaring env
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




# Bundle app source
COPY . .

# generate the prisma database client
# RUN npx prisma generate

# Build the TypeScript files
RUN npm run build

# Expose port 8080
EXPOSE ${PORT}

# Start the app
CMD npm run start
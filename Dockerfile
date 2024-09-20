# First stage: Build
FROM node:20 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json, yarn.lock, and .env files to the container
COPY package.json yarn.lock ./
COPY .env.prod ./

# Install dependencies using yarn
RUN yarn install --frozen-lockfile

# Copy the rest of the project files to the container
COPY . .

# Generate model types
RUN npx prisma generate

# Build the project (compile TypeScript to JavaScript and copy necessary files)
RUN yarn build

# Second stage: Production
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy only the built files from the previous stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/yarn.lock ./
COPY --from=build /app/.env ./
COPY --from=build /app/prisma ./prisma

RUN yarn install --production --frozen-lockfile
RUN yarn add cross-env

# Expose the port the app will run on
EXPOSE 3000

# Run the app in production mode
CMD ["yarn", "start:prod"]
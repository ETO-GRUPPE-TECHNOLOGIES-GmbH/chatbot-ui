# Use the Node.js official image as a parent image
# FROM node:20
FROM node:20.0.0 AS base


# Set the working directory in the container
WORKDIR /usr/src/app


# Copy package.json and package-lock.json (or yarn.lock) to the container working directory
COPY package*.json ./

# install node dependencys
RUN npm cache clean -f
RUN npm ci

# Copy the rest of the application to the container working directory
COPY . .

# Build the Next.js application
RUN npm run build

# Produktions-Image
FROM node:20.0.0 AS production

# Setze das Arbeitsverzeichnis für das Produktions-Image
WORKDIR /usr/src/app

# Kopiere die Standalone-Build-Dateien aus dem vorherigen Build-Schritt
COPY --from=base /usr/src/app/.next/standalone ./
COPY --from=base /usr/src/app/.next/static ./.next/static
COPY --from=base /usr/src/app/public ./public

# Setze die Umgebungsvariablen für die Produktion
ENV NODE_ENV=production
ENV PORT=3000

# Exponiere den Port 3000
EXPOSE 3000

# Starte die Anwendung mit dem Standalone-Server
CMD ["node", "server.js"]
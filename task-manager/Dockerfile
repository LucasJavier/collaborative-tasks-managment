# Usa una imagen base ligera de Node.js compatible con tu versión
FROM node:20-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar solo los archivos necesarios para instalar las dependencias
COPY package.json package-lock.json ./

# Instalar todas las dependencias (producción y desarrollo)
RUN npm install

# Copiar el resto del código de tu aplicación
COPY . .

# Copiar los archivos de entorno al contenedor
COPY .env .env.local ./

# Generar el cliente de Prisma
RUN npx prisma generate

# Construir la aplicación de Next.js
RUN npm run build

# Eliminar dependencias de desarrollo para reducir el tamaño de la imagen
RUN npm prune --production

# Establecer variables de entorno necesarias para la app
ENV NODE_ENV=production

# Exponer el puerto en el que tu aplicación correrá
EXPOSE 3000

# Comando por defecto para iniciar la aplicación
CMD ["npm", "start"]
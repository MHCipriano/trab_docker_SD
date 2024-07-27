
# Usar uma imagem base do Node.js
#FROM node:14.16.0-alpine3.13
FROM node:14


# Definir o diretório de trabalho
#WORKDIR /usr/src
WORKDIR /usr/src/app

# Copiar os arquivos de package.json e package-lock.json
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar todos os arquivos do projeto
COPY . .

# Expor a porta 3000
EXPOSE 3000

# Iniciar o aplicativo React
CMD ["npm", "start"]

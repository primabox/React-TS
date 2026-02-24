FROM node:20-slim
WORKDIR /app

# Nejdřív kopírujeme jen seznamy balíčků
COPY package*.json ./

# Instalujeme čistě v prostředí kontejneru
RUN npm install

# Pak zkopírujeme zbytek kódu
COPY . .

CMD ["npm", "run", "dev"]
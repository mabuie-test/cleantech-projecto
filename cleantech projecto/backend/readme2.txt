Passo a passo para rodar o backend localmente (o que te entreguei em Node.js + Express + MongoDB Atlas + M-Pesa API mock):

-----------------------------------------------------------

📦 Pré-requisitos

1. Instalar Node.js (recomendo v18 LTS ou superior).


2. Instalar npm (já vem junto com o Node).


3. Ter acesso a uma base MongoDB Atlas (podes usar cluster free).


4. Ter o Git instalado (opcional, mas ajuda).

-----------------------------------------------

⚙️ Passos

1. Clonar ou criar pasta do projeto

git clone https://github.com/teu-repo/clean-tech-backend.git
cd clean-tech-backend

(Se não usas Git, só cria uma pasta e copia os ficheiros que te dei para dentro dela.)


--------------------------------------------------------------------------

2. Instalar dependências

npm install

Isso vai baixar pacotes do package.json (Express, Mongoose, Socket.io, JWT, dotenv, etc).


---

3. Criar arquivo .env

Na raiz do backend, cria um ficheiro chamado .env com:

PORT=4000
MONGO_URI=mongodb+srv://USUARIO:SENHA@cluster0.mongodb.net/cleantech
JWT_SECRET=segredo_super_forte
MPESA_API_KEY=test_api_key
MPESA_PUBLIC_KEY=test_public_key

⚠️ Substitui USUARIO:SENHA pelos dados da tua conta do MongoDB Atlas.


------------------------------------------------------------------------------------

4. Rodar o servidor

npm run dev

ou

node src/index.js

Se tudo estiver certo, vais ver no terminal:

Servidor rodando na porta 4000
Conectado ao MongoDB Atlas


--------------------------------------------------------------------------

5. Testar a API

Com o servidor rodando:

Registro de usuário


POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "name": "Carlos",
  "phone": "841234567",
  "password": "123456",
  "role": "cliente"
}

Login


POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "phone": "841234567",
  "password": "123456"
}

O login vai devolver um JWT token que deves usar no app Android para acessar endpoints protegidos.


---------------------------------------------------------

6. Notificações em tempo real (Socket.io)

Com o servidor ativo, abre o painel web (Next.js) e o app Android → ambos vão receber notificações via Socket.io (sem precisar do Firebase por agora).


Como usar / passos rápidos

1. Local com Docker (recomendado para testes)

No directório backend/ rode:

docker-compose up --build

Isso inicia MongoDB e backend (com MPESA_PROVIDER=simulator no docker-compose.yml).

Abra http://localhost:4000/api/health para checar.

2. Sem Docker (Node local)

npm install

Copiar .env.example → .env e preencher (MONGODB_URI, JWT_SECRET, MPESA_* se for usar real)

npm run dev

3. Testar com Postman

Importe backend/postman/CleanTech-API.postman_collection.json no Postman.

Configure baseUrl (ex.: http://localhost:4000).

Registe um utilizador → faça login → pegue o token → crie pedido → inicie mpesa → (simule callback).

4. Ir para produção com Vodacom M-Pesa

Registe-se no portal Vodacom M-Pesa Open API (Vodacom Moçambique) e obtenha as credenciais e endpoints. 

Atualize .env com MPESA_PROVIDER=vodacom_mz e MPESA_API_URL, MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_SERVICE_PROVIDER_CODE, MPESA_CALLBACK_URL, etc.

Ajuste services/mpesaService.js endpoint strings caso Vodacom use paths diferentes (o arquivo contém comentários indicando onde ajustar).

............................................................................................................................................................................................................................................................................
Observações técnicas e recomendações finais

A implementação M-Pesa está preparada para três modos: simulator (para testes locais), vodacom_mz (Vodacom Mozambique Open API — você deve ajustar o endpoint conforme a documentação e informações de credenciais recebidas) e safaricom (Daraja/STK Push pattern). 

Para escalar sockets em múltiplas instâncias, use socket.io-redis adapter e instância Redis.

Proteja endpoints sensíveis com HTTPS; o callback do provedor deve apontar para URL pública com certificado válido.

Teste o fluxo completo com o Postman collection: primeiro register → login → create order → init mpesa → simular mpesa/callback.

Se quiser, faço agora um script de seed para criar contas demo (cliente + 2 recolhedores) no MongoDB e também o código do frontend web (Next.js) que consome estes endpoints e mostra mapa Leaflet com sockets. Diga “Sim — seed + dashboard web” se quiser que eu adicione.

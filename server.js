const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Carregar variáveis de ambiente do arquivo .env

// Requerir MercadoPagoConfig y Preference do SDK do Mercado Pago
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

// Configurando o Mercado Pago com as credenciais de acesso
const mp = new MercadoPagoConfig({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN, // Use o Access Token do Mercado Pago
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const SECRET_KEY = process.env.SECRET_KEY; // Chave secreta para o JWT
let purchaseCount = 0; // Contador de compras

// Rota para criar a preferência de pagamento
app.post('/api/pay', async (req, res) => {
  const preference = new Preference(mp);

  const body = {
    items: [
      {
        title: 'Compra de vídeo',
        quantity: 1,
        currency_id: 'BRL',
        unit_price: 1.0, // Preço do vídeo
      },
    ],
    back_urls: {
      success: 'http://localhost:3000/success',
      failure: 'http://localhost:3000/failure',
      pending: 'http://localhost:3000/pending',
    },
    auto_return: 'approved',
  };

  try {
    // Criar a preferência de pagamento
    const response = await preference.create({ body });
    res.status(200).json({ init_point: response.body.init_point });
  } catch (error) {
    console.error('Erro ao criar preferência de pagamento:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rota para verificar o pagamento e gerar o token JWT
app.get('/api/verify_payment', async (req, res) => {
  const { payment_id } = req.query;

  try {
    // Instanciar a classe de pagamento e verificar o status
    const payment = new Payment(mp);
    const response = await payment.get(payment_id);

    if (response.body.status === 'approved') {
      purchaseCount++; // Incrementar contador de compras

      // Gerar o token JWT válido por 1 hora
      const token = jwt.sign({ paid: true }, SECRET_KEY, { expiresIn: '1h' });
      res.status(200).json({ token });
    } else {
      res.status(400).json({ error: 'Pagamento não aprovado.' });
    }
  } catch (error) {
    console.error('Erro ao verificar pagamento:', error);
    res.status(500).json({ error: error.message });
  }
});

// Middleware para proteger a rota de acesso ao vídeo
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Token não fornecido.');

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).send('Falha ao autenticar o token.');
    req.user = decoded;
    next();
  });
}

// Rota protegida para servir o vídeo completo após o pagamento
app.get('/secure_videos/meu-video.mp4', verifyToken, (req, res) => {
  const videoPath = path.join(__dirname, 'videos', 'meu-video.mp4');
  res.sendFile(videoPath);
});

// Rota para obter a contagem atual de compras
app.get('/api/purchase-count', (req, res) => {
  res.json({ purchaseCount });
});

// Iniciar o servidor na porta 3001
app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});

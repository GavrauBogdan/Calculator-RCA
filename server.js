require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Funcție ajutătoare pentru a lua Token-ul de la Pasul 1
async function getAuthToken() {
  const response = await axios.post(`${process.env.LIH_BASE_URL}/auth`, {
    account: process.env.LIH_ACCOUNT,
    password: process.env.LIH_PASSWORD
  });
  return response.data.data.token;
}

// Ruta 1: Cere ofertă (Pasul 3)
app.post('/api/offer', async (req, res) => {
  try {
    const token = await getAuthToken();
    const offerResponse = await axios.post(
      `${process.env.LIH_BASE_URL}/offer`,
      req.body,
      {
        headers: { Token: token }
      }
    );
    res.json(offerResponse.data);
  } catch (error) {
    const errData = error.response ? error.response.data : error.message;
    res.status(400).json(errData);
  }
});

// Ruta 2: Transformă oferta în poliță - GetPolicy (Pasul 4)
app.post('/api/policy', async (req, res) => {
  try {
    const token = await getAuthToken();
    const { offerId } = req.body;

    const policyResponse = await axios.post(
      `${process.env.LIH_BASE_URL}/policy`,
      { offerId: offerId },
      {
        headers: { Token: token }
      }
    );
    res.json(policyResponse.data);
  } catch (error) {
    const errData = error.response ? error.response.data : error.message;
    res.status(400).json(errData);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serverul ruleaza pe http://localhost:${PORT}`);
});
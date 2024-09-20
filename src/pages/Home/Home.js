// src/pages/Home/Home.js

import React, { useState, useEffect } from 'react';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import { Box, AppBar, Toolbar, Typography } from '@mui/material';

const Home = () => {
  const [paid, setPaid] = useState(false);
  const [purchaseCount, setPurchaseCount] = useState(0);

  const handlePayment = () => {
    fetch('http://localhost:3001/api/pay', {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((data) => {
        // Redireciona para a página de pagamento
        window.location.href = data.init_point;
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setPaid(true);
    }
  
    // Função para buscar a contagem de compras
    const fetchPurchaseCount = () => {
      fetch('http://localhost:3001/api/purchase-count')
        .then((response) => response.json())
        .then((data) => {
          setPurchaseCount(data.purchaseCount);
        })
        .catch((error) => console.error('Erro ao buscar contagem de compras:', error));
    };
  
    fetchPurchaseCount(); // Busca inicial
  
    // Atualiza a contagem de compras sempre que o pagamento for realizado
    if (paid) {
      fetchPurchaseCount();
    }
  }, [paid]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Meu Site de Vídeo
          </Typography>
          <Typography variant="subtitle1">
            Vendas realizadas: {purchaseCount}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <VideoPlayer paid={paid} setPaid={setPaid} handlePayment={handlePayment} />
      </Box>
    </>
  );
};

export default Home;

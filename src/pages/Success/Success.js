// src/pages/Success/Success.js

import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const payment_id = searchParams.get('payment_id');

    // Faz uma requisição ao backend para verificar o pagamento e obter o token
    fetch(`http://localhost:3001/api/verify_payment?payment_id=${payment_id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          navigate('/'); // Redireciona para a página inicial
        } else {
          console.error('Erro ao obter token:', data.error);
        }
      })
      .catch((error) => console.error('Erro ao verificar pagamento:', error));
  }, [searchParams, navigate]);

  return (
    <Container sx={{ textAlign: 'center', mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Processando pagamento...
      </Typography>
    </Container>
  );
};

export default Success;

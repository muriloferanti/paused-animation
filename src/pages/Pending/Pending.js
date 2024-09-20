// src/pages/Pending/Pending.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';

const Pending = () => {
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate('/');
  };

  return (
    <Container sx={{ textAlign: 'center', mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Pagamento em processamento
      </Typography>
      <Typography variant="body1" gutterBottom>
        Seu pagamento está sendo processado. Você poderá acessar o conteúdo assim que for aprovado.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleReturn}>
        Voltar para o início
      </Button>
    </Container>
  );
};

export default Pending;

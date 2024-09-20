// src/pages/Failure/Failure.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';

const Failure = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate('/');
  };

  return (
    <Container sx={{ textAlign: 'center', mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Pagamento não concluído
      </Typography>
      <Typography variant="body1" gutterBottom>
        Ocorreu um problema ao processar seu pagamento.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleRetry}>
        Tentar novamente
      </Button>
    </Container>
  );
};

export default Failure;

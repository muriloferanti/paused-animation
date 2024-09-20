// src/components/PaymentButton/PaymentButton.js

import React from 'react';
import { Button } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import './PaymentButton.css';

const PaymentButton = ({ handlePayment }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<PaymentIcon />}
      onClick={handlePayment}
      className="payment-button"
    >
      Pagar R$1,00 para continuar
    </Button>
  );
};

export default PaymentButton;

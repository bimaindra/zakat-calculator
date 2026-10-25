import React from 'react';
import BaseZakatCalculator from './base-zakat-calculator';

const ZakatMaal = () => {
  return <BaseZakatCalculator type="maal" />;
};

export default React.memo(ZakatMaal);

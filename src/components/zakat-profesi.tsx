import React from 'react';
import BaseZakatCalculator from './base-zakat-calculator';

const ZakatProfesi = () => {
	return <BaseZakatCalculator type="profesi" />;
};

export default React.memo(ZakatProfesi);

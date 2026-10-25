import type { ZakatConstants, FormFieldConfig } from '../types';

export const ZAKAT_CONFIG: ZakatConstants = {
  goldPrice: 1089000,
  nishabMultiplier: 85,
  zakatRate: 0.025,
  monthsPerYear: 12,
};

export const CURRENCY_CONFIG = {
  prefix: 'Rp',
  groupSeparator: '.',
  decimalSeparator: ',',
  decimalsLimit: 4,
  placeholder: 'Rp.',
};

export const UI_CONFIG = {
  toastDuration: 1750,
  modalDelay: 2000,
  maxSignificantDigits: 4,
};

export const FORM_FIELDS: Record<'profesi' | 'maal', FormFieldConfig[]> = {
  profesi: [
    {
      key: 'penghasilan',
      label: 'Jumlah pendapatan /bulan',
      isRequired: true,
      placeholder: 'Masukkan pendapatan bulanan',
      helpText: 'Masukkan jumlah gaji atau pendapatan tetap per bulan',
      validationRules: [
        {
          type: 'required',
          message: 'Pendapatan bulanan harus diisi',
        },
        {
          type: 'minValue',
          value: 1000,
          message: 'Pendapatan minimal Rp 1.000',
        },
        {
          type: 'maxValue',
          value: 1000000000,
          message: 'Pendapatan tidak boleh melebihi Rp 1 miliar',
        },
      ],
    },
    {
      key: 'bonus',
      label: 'Bonus, THR dan lainnya',
      isRequired: false,
      placeholder: 'Masukkan bonus (opsional)',
      helpText: 'Termasuk THR, bonus tahunan, atau pendapatan tambahan lainnya',
      validationRules: [
        {
          type: 'minValue',
          value: 0,
          message: 'Bonus tidak boleh bernilai negatif',
        },
        {
          type: 'maxValue',
          value: 1000000000,
          message: 'Bonus tidak boleh melebihi Rp 1 miliar',
        },
      ],
    },
  ],
  maal: [
    {
      key: 'emas',
      label: 'Nilai emas, perak, dan/atau permata',
      isRequired: true,
      placeholder: 'Masukkan nilai emas/perhiasan',
      helpText: 'Masukkan nilai total emas, perak, dan perhiasan yang dimiliki',
      validationRules: [
        {
          type: 'required',
          message: 'Nilai emas/perhiasan harus diisi',
        },
        {
          type: 'minValue',
          value: 0,
          message: 'Nilai tidak boleh negatif',
        },
        {
          type: 'maxValue',
          value: 10000000000,
          message: 'Nilai tidak boleh melebihi Rp 10 miliar',
        },
      ],
    },
    {
      key: 'tabungan',
      label: 'Uang tunai, tabungan, deposito',
      isRequired: true,
      placeholder: 'Masukkan jumlah uang tunai',
      helpText: 'Termasuk uang kas, tabungan, deposito, dan investasi likuid',
      validationRules: [
        {
          type: 'required',
          message: 'Jumlah uang tunai harus diisi',
        },
        {
          type: 'minValue',
          value: 0,
          message: 'Jumlah tidak boleh negatif',
        },
        {
          type: 'maxValue',
          value: 10000000000,
          message: 'Jumlah tidak boleh melebihi Rp 10 miliar',
        },
      ],
    },
    {
      key: 'asset',
      label: 'Kendaraan, rumah, aset lain',
      isRequired: true,
      placeholder: 'Masukkan nilai aset',
      helpText: 'Nilai kendaraan, properti, dan aset berharga lainnya',
      validationRules: [
        {
          type: 'required',
          message: 'Nilai aset harus diisi',
        },
        {
          type: 'minValue',
          value: 0,
          message: 'Nilai tidak boleh negatif',
        },
        {
          type: 'maxValue',
          value: 50000000000,
          message: 'Nilai tidak boleh melebihi Rp 50 miliar',
        },
      ],
    },
    {
      key: 'hutang',
      label: 'Jumlah hutang/cicilan (optional)',
      isRequired: false,
      placeholder: 'Masukkan hutang (opsional)',
      helpText: 'Jumlah hutang atau cicilan yang harus dibayar',
      validationRules: [
        {
          type: 'minValue',
          value: 0,
          message: 'Hutang tidak boleh bernilai negatif',
        },
        {
          type: 'maxValue',
          value: 10000000000,
          message: 'Hutang tidak boleh melebihi Rp 10 miliar',
        },
      ],
    },
  ],
};

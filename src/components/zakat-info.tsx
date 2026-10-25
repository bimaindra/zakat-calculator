import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  Text,
} from '@chakra-ui/react';
import { ZAKAT_CONFIG } from '../constants';
import type { ZakatType } from '../types';

interface ZakatInfoProps {
  type: ZakatType;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID').format(amount);
};

const ZakatInfo = ({ type }: ZakatInfoProps) => {
  const isZakatMaal = type === 'maal';

  return (
    <Accordion allowToggle mb={6}>
      <AccordionItem border="none">
        <Heading as="h3">
          <AccordionButton px={0} py={2} mb={2}>
            <Box as="span" flex="1" textAlign="left" fontWeight="bold" fontSize="lg">
              Informasi Selengkapnya...
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel>
          <Box lineHeight="tall">
            {isZakatMaal ? (
              <>
                <Text mb={4}>
                  <strong>
                    <em>Zakat Maal</em>
                  </strong>{' '}
                  yang dimaksud dalam perhitungan ini adalah zakat yang dikenakan atas uang, emas,
                  surat berharga, dan aset yang disewakan. Tidak termasuk harta pertanian,
                  pertambangan, dan lain-lain yang diatur dalam UU No.23/2011 tentang pengelolaan
                  zakat.
                </Text>
                <Text mb={4}>
                  Zakat maal harus sudah mencapai nishab (batas minimum) dan terbebas dari hutang
                  serta kepemilikan telah mencapai 1 tahun (haul). Nishab zakat maal sebesar{' '}
                  {ZAKAT_CONFIG.nishabMultiplier} gram emas. Kadar zakatnya senilai{' '}
                  {ZAKAT_CONFIG.zakatRate * 100}%.
                </Text>
              </>
            ) : (
              <>
                <Text mb={4}>
                  <strong>
                    <em>Zakat Profesi</em>
                  </strong>{' '}
                  atau yang dikenal juga sebagai{' '}
                  <strong>
                    <em>Zakat Penghasilan</em>
                  </strong>{' '}
                  adalah bagian dari zakat maal yang wajib dikeluarkan atas harta yang berasal dari
                  pendapatan / penghasilan rutin dari pekerjaan yang tidak melanggar syariah.
                </Text>
                <Text mb={4}>
                  Nishab zakat penghasilan sebesar {ZAKAT_CONFIG.nishabMultiplier} gram emas per
                  tahun. Kadar zakat penghasilan senilai {ZAKAT_CONFIG.zakatRate * 100}%. Dalam
                  praktiknya, zakat penghasilan dapat ditunaikan setiap bulan dengan nilai nishab
                  per bulannya adalah setara dengan nilai seperduabelas dari{' '}
                  {ZAKAT_CONFIG.nishabMultiplier}
                  gram emas, dengan kadar {ZAKAT_CONFIG.zakatRate * 100}%.
                </Text>
                <Text mb={4}>
                  Jadi apabila penghasilan setiap bulan telah melebihi nilai nishab bulanan, maka
                  wajib dikeluarkan zakatnya sebesar {ZAKAT_CONFIG.zakatRate * 100}% dari
                  penghasilannya tersebut.
                </Text>
              </>
            )}
            <Text mb={4}>
              Standar harga emas yg digunakan untuk 1 gram nya adalah Rp
              {formatCurrency(ZAKAT_CONFIG.goldPrice)},-. Sementara nishab yang digunakan adalah
              sebesar {ZAKAT_CONFIG.nishabMultiplier}
              gram emas.
            </Text>
            <Text>
              <em>
                (Sumber: Al Qur&apos;an Surah Al Baqarah ayat 267, Peraturan Menteri Agama Nomer 31
                Tahun 2019, Fatwa MUI Nomer 3 Tahun 2003, dan pendapat Shaikh Yusuf Qardawi).
              </em>
            </Text>
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default ZakatInfo;

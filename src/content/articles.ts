// Draf konten SEO. Wajib ditinjau oleh pemilik situs/ustadz sebelum rilis
// untuk memastikan ketepatan fikih dan rujukan.
import { formatDecimal, formatRupiah } from '@/lib/format';
import type { FaqItem } from '@/lib/seo';
import {
  DEFAULT_RICE_PRICE_PER_KG,
  FITRAH_RICE_KG,
  NISAB_GOLD_GRAMS,
  calculateFitrah,
  calculateMaal,
  calculatePerdagangan,
  calculateProfesi,
  monthlyNisab,
  yearlyNisab,
} from '@/lib/zakat';
import type { CalculatorId } from './calculators';

/** Tahun saat build; judul halaman ikut diperbarui setiap kali situs dibangun ulang. */
export const BUILD_YEAR = new Date().getFullYear();

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export interface WorkedExample {
  scenario: string;
  steps: string[];
  conclusion: string;
}

export interface Source {
  label: string;
  url: string;
}

export interface Article {
  seoTitle: string;
  description: string;
  breadcrumb: string;
  sections: ArticleSection[];
  formula: string;
  example: (goldPricePerGram: number) => WorkedExample;
  faq: FaqItem[];
  sources: Source[];
}

const QURAN_AT_TAUBAH_103: Source = {
  label: 'QS. At-Taubah [9]: 103',
  url: 'https://quran.com/9/103',
};
const QURAN_AL_BAQARAH_267: Source = {
  label: 'QS. Al-Baqarah [2]: 267',
  url: 'https://quran.com/2/267',
};
const HADITH_NISAB: Source = {
  label: 'HR. Abu Dawud no. 1573 (nisab 20 dinar dan haul)',
  url: 'https://sunnah.com/abudawud:1573',
};
const BAZNAS: Source = { label: 'BAZNAS RI', url: 'https://baznas.go.id' };
const PMA_52_2014: Source = {
  label: 'Peraturan Menteri Agama No. 52 Tahun 2014 (diubah PMA No. 31 Tahun 2019)',
  url: 'https://peraturan.go.id',
};

const nisabSentence = (goldPricePerGram: number) =>
  `Dengan harga emas ${formatRupiah(goldPricePerGram)}/gram, nisab setahun adalah ${NISAB_GOLD_GRAMS} × ${formatRupiah(goldPricePerGram)} = ${formatRupiah(yearlyNisab(goldPricePerGram))}.`;

export const HOME_ARTICLE = {
  seoTitle: `Kalkulator Zakat Online ${BUILD_YEAR}: Profesi, Maal, Fitrah`,
  description:
    'Hitung zakat profesi, maal, fitrah, dan perdagangan secara gratis. Nisab mengikuti harga emas terkini, hasil langsung muncul, data tetap di perangkat Anda.',
  sections: [
    {
      heading: 'Apa itu zakat?',
      paragraphs: [
        'Zakat adalah bagian tertentu dari harta yang wajib dikeluarkan seorang muslim bila hartanya telah mencapai batas minimal (nisab), lalu diberikan kepada golongan yang berhak menerimanya (mustahik). Zakat termasuk rukun Islam yang ketiga.',
        'Secara umum ada dua jenis zakat: zakat fitrah yang wajib bagi setiap jiwa menjelang Idulfitri, dan zakat maal (harta) yang mencakup zakat penghasilan, simpanan, emas, perdagangan, dan lainnya.',
      ],
    },
    {
      heading: 'Bagaimana kalkulator ini menghitung?',
      paragraphs: [
        'Nisab zakat maal, profesi, dan perdagangan disetarakan dengan 85 gram emas. Kalkulator mengambil harga emas internasional terbaru dan mengonversinya ke rupiah per gram, lalu membandingkannya dengan harta atau penghasilan yang Anda masukkan. Bila mencapai nisab, zakatnya 2,5%.',
        'Anda dapat mengganti harga emas dengan harga lain, misalnya harga emas Antam hari ini, melalui tombol "Ubah". Semua perhitungan berjalan di browser Anda; tidak ada data harta yang dikirim ke server.',
      ],
    },
    {
      heading: 'Siapa yang berhak menerima zakat?',
      paragraphs: [
        'Al-Qur’an (QS. At-Taubah: 60) menyebut delapan golongan penerima zakat (asnaf):',
      ],
      list: [
        'Fakir',
        'Miskin',
        'Amil (pengelola zakat)',
        'Mualaf',
        'Riqab (memerdekakan budak)',
        'Gharim (orang yang terlilit utang)',
        'Fisabilillah',
        'Ibnu sabil (musafir yang kehabisan bekal)',
      ],
    },
  ],
  faq: [
    {
      question: 'Apakah kalkulator zakat ini gratis dan aman?',
      answer:
        'Ya. Kalkulator ini gratis tanpa pendaftaran. Semua perhitungan dilakukan di perangkat Anda dan angka harta tidak pernah dikirim ke server mana pun.',
    },
    {
      question: 'Berapa nisab zakat hari ini?',
      answer:
        'Nisab zakat maal setara 85 gram emas. Nilai rupiahnya mengikuti harga emas terkini yang ditampilkan di bagian atas halaman, dan untuk zakat profesi dibagi 12 menjadi nisab bulanan.',
    },
    {
      question: 'Apa beda zakat fitrah dan zakat maal?',
      answer:
        'Zakat fitrah wajib bagi setiap muslim yang mampu, dibayar menjelang Idulfitri sebesar 2,5 kg beras per jiwa. Zakat maal adalah zakat atas harta yang mencapai nisab dan haul, besarnya 2,5%.',
    },
    {
      question: 'Ke mana sebaiknya zakat dibayarkan?',
      answer:
        'Zakat dapat disalurkan melalui lembaga amil zakat resmi seperti BAZNAS atau LAZ yang berizin, atau langsung kepada mustahik di sekitar Anda.',
    },
  ] satisfies FaqItem[],
  sources: [QURAN_AT_TAUBAH_103, BAZNAS, PMA_52_2014],
};

export const ARTICLES: Record<CalculatorId, Article> = {
  profesi: {
    seoTitle: `Kalkulator Zakat Profesi ${BUILD_YEAR}: Hitung Zakat Gaji`,
    description:
      'Hitung zakat profesi atau zakat penghasilan dari gaji Anda, per bulan atau per tahun. Nisab mengikuti harga 85 gram emas terkini, kadar 2,5%, hasil langsung muncul.',
    breadcrumb: 'Zakat Profesi',
    sections: [
      {
        heading: 'Apa itu zakat profesi?',
        paragraphs: [
          'Zakat profesi (zakat penghasilan) adalah zakat yang dikeluarkan dari pendapatan rutin seperti gaji, honorarium, upah, dan penghasilan jasa profesional. Ketentuan ini merujuk pada Fatwa MUI No. 3 Tahun 2003 tentang Zakat Penghasilan dan diatur dalam regulasi Kementerian Agama.',
          'Banyak orang menunaikannya setiap bulan saat menerima gaji, sehingga nisabnya dihitung per bulan: 85 gram emas dibagi 12. Bila lebih nyaman membayar setahun sekali, pilih "Per tahun" di kalkulator: penghasilan setahun dibandingkan langsung dengan nisab 85 gram emas.',
        ],
      },
      {
        heading: 'Syarat wajib zakat profesi',
        paragraphs: ['Zakat profesi wajib dikeluarkan bila:'],
        list: [
          'Beragama Islam dan merdeka',
          'Penghasilan diperoleh dengan cara yang halal',
          'Penghasilan bulanan mencapai nisab (setara 85 gram emas per tahun ÷ 12)',
        ],
      },
    ],
    formula: 'Zakat profesi = 2,5% × (penghasilan bulanan + bonus/pendapatan lain bulan itu)',
    example: (goldPricePerGram) => {
      const result = calculateProfesi(
        { monthlyIncome: 18_000_000, bonus: 2_000_000 },
        goldPricePerGram
      );
      return {
        scenario: 'Andi bergaji Rp 18.000.000 per bulan dan bulan ini menerima bonus Rp 2.000.000.',
        steps: [
          `Nisab per bulan = (85 × ${formatRupiah(goldPricePerGram)}) ÷ 12 = ${formatRupiah(monthlyNisab(goldPricePerGram))}.`,
          `Total penghasilan = ${formatRupiah(result.total)}.`,
          result.isWajib
            ? `Karena mencapai nisab, zakatnya 2,5% × ${formatRupiah(result.total)} = ${formatRupiah(result.amount)}.`
            : 'Total penghasilan belum mencapai nisab, sehingga belum wajib zakat.',
        ],
        conclusion: result.isWajib
          ? `Andi membayar zakat profesi ${formatRupiah(result.amount)} bulan ini.`
          : 'Andi belum wajib zakat profesi bulan ini, tetapi dianjurkan bersedekah.',
      };
    },
    faq: [
      {
        question: 'Zakat profesi dihitung dari gaji kotor atau bersih?',
        answer:
          'Kalkulator ini memakai penghasilan kotor (bruto) sesuai panduan BAZNAS. Sebagian ulama membolehkan menghitung dari penghasilan setelah kebutuhan pokok; pilih pendapat yang Anda yakini.',
      },
      {
        question: 'Berapa nisab zakat profesi per bulan?',
        answer:
          'Nisab zakat profesi setara 85 gram emas per tahun dibagi 12. Angka rupiahnya mengikuti harga emas terkini yang tampil di kalkulator.',
      },
      {
        question: 'Apakah THR dan bonus terkena zakat profesi?',
        answer:
          'Ya. THR, bonus, dan pendapatan tambahan lain dijumlahkan dengan gaji pada bulan diterimanya, lalu dibandingkan dengan nisab.',
      },
      {
        question: 'Bolehkah zakat profesi dibayar setahun sekali?',
        answer:
          'Boleh. Anda dapat menjumlahkan penghasilan setahun, membandingkannya dengan nisab 85 gram emas, lalu membayar 2,5% di akhir tahun.',
      },
      {
        question: 'Bagaimana jika gaji saya di bawah nisab?',
        answer:
          'Anda belum wajib zakat profesi. Meski begitu, infak dan sedekah tetap sangat dianjurkan.',
      },
    ],
    sources: [
      QURAN_AL_BAQARAH_267,
      {
        label: 'Fatwa MUI No. 3 Tahun 2003 tentang Zakat Penghasilan',
        url: 'https://mui.or.id/produk/fatwa',
      },
      BAZNAS,
      PMA_52_2014,
    ],
  },

  maal: {
    seoTitle: `Kalkulator Zakat Maal ${BUILD_YEAR}: Tabungan, Emas, Investasi`,
    description:
      'Hitung zakat maal atas tabungan, emas, dan investasi yang telah tersimpan setahun. Nisab 85 gram emas mengikuti harga terkini, kadar 2,5%.',
    breadcrumb: 'Zakat Maal',
    sections: [
      {
        heading: 'Apa itu zakat maal?',
        paragraphs: [
          'Zakat maal adalah zakat atas harta simpanan yang dimiliki penuh, telah mencapai nisab, dan tersimpan selama satu tahun hijriah (haul). Contohnya uang tunai, tabungan, deposito, emas dan perak, serta investasi seperti saham dan reksa dana.',
          'Rumah yang ditinggali, kendaraan pribadi, dan perabot yang dipakai sehari-hari tidak termasuk harta yang dizakati.',
        ],
      },
      {
        heading: 'Syarat wajib zakat maal',
        paragraphs: ['Harta wajib dizakati bila memenuhi syarat berikut:'],
        list: [
          'Milik penuh dan diperoleh secara halal',
          'Berkembang atau berpotensi berkembang',
          'Mencapai nisab setara 85 gram emas setelah dikurangi utang jatuh tempo',
          'Telah dimiliki selama satu tahun hijriah (haul)',
        ],
      },
    ],
    formula: 'Zakat maal = 2,5% × (tabungan + emas/perak + investasi − utang jatuh tempo)',
    example: (goldPricePerGram) => {
      const input = {
        savings: 150_000_000,
        gold: 50_000_000,
        investments: 30_000_000,
        debts: 10_000_000,
      };
      const result = calculateMaal(input, goldPricePerGram);
      return {
        scenario:
          'Siti memiliki tabungan Rp 150 juta, emas senilai Rp 50 juta, dan reksa dana Rp 30 juta yang sudah tersimpan setahun. Ia punya cicilan jatuh tempo Rp 10 juta.',
        steps: [
          nisabSentence(goldPricePerGram),
          `Harta bersih = 150 jt + 50 jt + 30 jt − 10 jt = ${formatRupiah(result.total)}.`,
          result.isWajib
            ? `Karena mencapai nisab, zakatnya 2,5% × ${formatRupiah(result.total)} = ${formatRupiah(result.amount)}.`
            : 'Harta bersih belum mencapai nisab, sehingga belum wajib zakat maal.',
        ],
        conclusion: result.isWajib
          ? `Siti membayar zakat maal ${formatRupiah(result.amount)} tahun ini.`
          : 'Siti belum wajib zakat maal tahun ini.',
      };
    },
    faq: [
      {
        question: 'Apa itu haul dalam zakat maal?',
        answer:
          'Haul adalah masa kepemilikan harta selama satu tahun hijriah (sekitar 354 hari). Zakat maal baru wajib setelah harta yang mencapai nisab dimiliki selama haul.',
      },
      {
        question: 'Apakah rumah dan mobil terkena zakat maal?',
        answer:
          'Tidak, selama dipakai sendiri. Rumah atau kendaraan yang disewakan tidak dizakati nilainya; hasil sewanya yang tersimpan dihitung sebagai tabungan.',
      },
      {
        question: 'Apakah perhiasan emas wajib dizakati?',
        answer:
          'Emas simpanan dan investasi wajib dizakati. Untuk perhiasan yang dipakai secara wajar, ulama berbeda pendapat; banyak lembaga zakat tidak mewajibkannya.',
      },
      {
        question: 'Bagaimana dengan utang KPR atau cicilan jangka panjang?',
        answer:
          'Yang dikurangkan hanya utang atau cicilan yang jatuh tempo saat zakat dihitung, bukan seluruh sisa pokok pinjaman jangka panjang.',
      },
      {
        question: 'Apakah saham dan kripto terkena zakat maal?',
        answer:
          'Ya, investasi seperti saham, reksa dana, sukuk, dan aset kripto yang halal dihitung berdasarkan nilai pasarnya saat zakat dibayar.',
      },
    ],
    sources: [QURAN_AT_TAUBAH_103, HADITH_NISAB, BAZNAS, PMA_52_2014],
  },

  fitrah: {
    seoTitle: `Kalkulator Zakat Fitrah ${BUILD_YEAR}: Beras & Uang per Jiwa`,
    description:
      'Hitung zakat fitrah untuk seluruh keluarga: 2,5 kg beras atau uang senilai itu per jiwa. Sesuaikan harga beras dengan ketetapan BAZNAS daerah Anda.',
    breadcrumb: 'Zakat Fitrah',
    sections: [
      {
        heading: 'Apa itu zakat fitrah?',
        paragraphs: [
          'Zakat fitrah adalah zakat yang wajib dikeluarkan setiap muslim, laki-laki maupun perempuan, dewasa maupun anak-anak, pada bulan Ramadan hingga sebelum salat Idulfitri. Tujuannya menyucikan orang yang berpuasa dan membantu fakir miskin merayakan hari raya.',
          'Besarnya satu sha’ makanan pokok, yang di Indonesia ditetapkan 2,5 kg beras (sebagian lembaga memakai 2,7 kg sebagai kehati-hatian). Zakat fitrah boleh dibayar dengan uang senilai harga beras tersebut.',
        ],
      },
      {
        heading: 'Siapa yang wajib membayar?',
        paragraphs: [
          'Setiap muslim yang memiliki kelebihan makanan untuk dirinya dan keluarganya pada malam dan hari raya. Kepala keluarga membayarkan zakat fitrah untuk dirinya dan setiap orang yang nafkahnya ia tanggung, termasuk bayi yang lahir sebelum matahari terbenam di akhir Ramadan.',
        ],
      },
    ],
    formula: `Zakat fitrah = jumlah jiwa × ${formatDecimal(FITRAH_RICE_KG)} kg × harga beras per kg`,
    example: () => {
      const result = calculateFitrah({ people: 4, ricePricePerKg: DEFAULT_RICE_PRICE_PER_KG });
      return {
        scenario: `Keluarga Budi terdiri atas 4 orang dan memakai harga beras ${formatRupiah(DEFAULT_RICE_PRICE_PER_KG)}/kg.`,
        steps: [
          `Total beras = 4 × ${formatDecimal(FITRAH_RICE_KG)} kg = ${formatDecimal(result.riceKg)} kg.`,
          `Bila dibayar dengan uang = ${formatDecimal(result.riceKg)} × ${formatRupiah(DEFAULT_RICE_PRICE_PER_KG)} = ${formatRupiah(result.amount)}.`,
        ],
        conclusion: `Budi membayar ${formatDecimal(result.riceKg)} kg beras atau ${formatRupiah(result.amount)} untuk keluarganya.`,
      };
    },
    faq: [
      {
        question: 'Berapa besar zakat fitrah per orang tahun ini?',
        answer:
          'Zakat fitrah adalah 2,5 kg beras per jiwa atau uang senilai itu. BAZNAS menetapkan nilai uangnya per wilayah setiap tahun; kalkulator ini memakai Rp 47.000 per jiwa sebagai nilai awal yang bisa Anda ubah.',
      },
      {
        question: 'Kapan batas waktu membayar zakat fitrah?',
        answer:
          'Zakat fitrah boleh dibayar sejak awal Ramadan dan paling lambat sebelum salat Idulfitri. Bila dibayar setelah salat Id, nilainya dihitung sebagai sedekah biasa.',
      },
      {
        question: 'Bolehkah zakat fitrah dibayar dengan uang?',
        answer:
          'Mazhab Hanafi membolehkan, dan BAZNAS serta banyak lembaga zakat di Indonesia menerimanya dengan nilai setara harga 2,5 kg beras.',
      },
      {
        question: 'Apakah bayi wajib dibayarkan zakat fitrah?',
        answer:
          'Ya, bila bayi lahir sebelum matahari terbenam pada hari terakhir Ramadan, zakat fitrahnya dibayarkan oleh orang tua atau walinya.',
      },
    ],
    sources: [
      {
        label: 'HR. Bukhari no. 1503 (kewajiban zakat fitrah satu sha’)',
        url: 'https://sunnah.com/bukhari:1503',
      },
      BAZNAS,
      PMA_52_2014,
    ],
  },

  perdagangan: {
    seoTitle: `Kalkulator Zakat Perdagangan ${BUILD_YEAR}: Zakat Usaha`,
    description:
      'Hitung zakat perdagangan atau zakat usaha dari stok barang, kas, dan piutang dikurangi utang jangka pendek. Nisab 85 gram emas, kadar 2,5%.',
    breadcrumb: 'Zakat Perdagangan',
    sections: [
      {
        heading: 'Apa itu zakat perdagangan?',
        paragraphs: [
          'Zakat perdagangan (zakat tijarah) adalah zakat atas harta yang diperjualbelikan untuk mencari keuntungan. Zakat ini dihitung dari aset lancar usaha, yaitu stok barang dagangan, kas, dan piutang yang dapat ditagih, setelah dikurangi utang jangka pendek.',
          'Aset tetap seperti bangunan toko, peralatan, dan kendaraan operasional tidak dihitung karena bukan barang yang diperdagangkan.',
        ],
      },
      {
        heading: 'Kapan zakat perdagangan dibayar?',
        paragraphs: [
          'Zakat perdagangan dibayar setiap usaha mencapai haul (satu tahun hijriah), biasanya bersamaan dengan tutup buku tahunan. Nilai stok barang dihitung dengan harga pasar saat itu.',
        ],
      },
    ],
    formula:
      'Zakat perdagangan = 2,5% × (stok barang + kas + piutang lancar − utang jangka pendek)',
    example: (goldPricePerGram) => {
      const input = {
        inventory: 200_000_000,
        cash: 60_000_000,
        receivables: 40_000_000,
        debts: 50_000_000,
      };
      const result = calculatePerdagangan(input, goldPricePerGram);
      return {
        scenario:
          'Toko milik Rina saat tutup buku memiliki stok barang Rp 200 juta, kas Rp 60 juta, piutang lancar Rp 40 juta, dan utang ke pemasok Rp 50 juta.',
        steps: [
          nisabSentence(goldPricePerGram),
          `Aset usaha bersih = 200 jt + 60 jt + 40 jt − 50 jt = ${formatRupiah(result.total)}.`,
          result.isWajib
            ? `Karena mencapai nisab, zakatnya 2,5% × ${formatRupiah(result.total)} = ${formatRupiah(result.amount)}.`
            : 'Aset bersih belum mencapai nisab, sehingga belum wajib zakat perdagangan.',
        ],
        conclusion: result.isWajib
          ? `Rina membayar zakat perdagangan ${formatRupiah(result.amount)} tahun ini.`
          : 'Rina belum wajib zakat perdagangan tahun ini.',
      };
    },
    faq: [
      {
        question: 'Apakah aset tetap usaha ikut dizakati?',
        answer:
          'Tidak. Bangunan, mesin, peralatan, dan kendaraan operasional tidak dihitung. Yang dizakati hanya aset lancar: stok barang, kas, dan piutang yang dapat ditagih.',
      },
      {
        question: 'Stok barang dihitung dengan harga beli atau harga jual?',
        answer:
          'Mayoritas ulama dan BAZNAS memakai harga pasar (harga jual wajar) saat zakat dihitung, bukan harga beli.',
      },
      {
        question: 'Bagaimana dengan piutang yang macet?',
        answer:
          'Piutang yang diragukan tertagih tidak dihitung dulu. Zakatnya dibayar ketika piutang tersebut sudah diterima.',
      },
      {
        question: 'Apakah usaha online dan dropship terkena zakat perdagangan?',
        answer:
          'Ya. Ketentuannya sama: hitung stok (bila ada), saldo usaha, dan piutang, lalu kurangi utang jangka pendek dan bandingkan dengan nisab.',
      },
    ],
    sources: [QURAN_AL_BAQARAH_267, HADITH_NISAB, BAZNAS, PMA_52_2014],
  },
};

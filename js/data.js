/* =========================================================
   KEMBARA KATA ADJEKTIF — Data Kandungan
   Kursus: EDUP3133 (Teknologi untuk Pengajaran dan Pembelajaran)
   Topik: Kata Adjektif | Bahasa Melayu SK Tahun 3
   DSKP: SK 5.1 (Memahami fungsi dan menggunakan golongan kata
   mengikut konteks) & SP 5.1.3 (Kata adjektif: jarak,
   perasaan, pancaindera)
   Model Reka Bentuk Pengajaran: ASSURE
   ========================================================= */

/* ---------- MAKLUMAT PRODUK ---------- */
const INFO = {
  namaProduk: "Kembara Kata Adjektif",
  sasaran: "Murid Tahun 3 Bahasa Melayu (SK)",
  model: "ASSURE",
  tajukKursus: "EDUP3133 Teknologi untuk Pengajaran dan Pembelajaran",
  bigIdea: "Kompetensi Guru Memperkasa Transformasi Pendidikan",
  dskpSK: "5.1 Memahami fungsi dan menggunakan golongan kata mengikut konteks",
  dskpSP: "5.1.3 Memahami dan menggunakan kata adjektif mengikut konteks (jarak, perasaan, pancaindera)",
  urlProduk: "[ISI URL PRODUK ANDA]",
  urlInstrumen: "[ISI URL GOOGLE FORMS ANDA]"
};

/* ---------- KELAYAKAN LOG MASUK (demo — sisi pelanggan) ---------- */
const LOGIN = {
  guruPass: "guru123",
  namaGuru: "Cikgu"
};

/* ---------- AVATAR MURID (pasangan warna gradien bulatan) ---------- */
const AVATAR = [
  ["#0071e3", "#7cb8ff"],
  ["#ff9f0a", "#ffd60a"],
  ["#30d158", "#a3f7bf"],
  ["#ff375f", "#ff8aa1"],
  ["#bf5af2", "#e5b3ff"],
  ["#64d2ff", "#c6f0ff"],
  ["#ac8e68", "#e0c9a8"],
  ["#ff453a", "#ff9f8a"]
];

/* ---------- OBJEKTIF PEMBELAJARAN (DSKP BM SK Tahun 3, 5.1.3) ---------- */
const OBJEKTIF = [
  "Mengenal pasti sekurang-kurangnya 12 kata adjektif mengikut jenis: jarak, perasaan dan pancaindera.",
  "Memahami fungsi kata adjektif sebagai perkataan yang menerangkan sifat atau keadaan.",
  "Menggunakan kata adjektif dalam ayat yang betul mengikut konteks.",
  "Mengelaskan kata adjektif kepada jarak, perasaan atau pancaindera dengan tepat."
];

/* ---------- KATEGORI KATA ADJEKTIF ---------- */
const KATEGORI = {
  jarak: { nama: "Jarak", warna: "#0071e3", huraian: "Kata adjektif yang menerangkan kedudukan atau jarak antara dua tempat." },
  perasaan: { nama: "Perasaan", warna: "#ff375f", huraian: "Kata adjektif yang menerangkan perasaan atau emosi seseorang." },
  pancaindera: { nama: "Pancaindera", warna: "#30d158", huraian: "Kata adjektif yang dikesan melalui pancaindera: lidah (rasa), hidung (bau), kulit (sentuhan), mata (pandangan) dan telinga (pendengaran)." }
};

/* ---------- DATA KATA ADJEKTIF (12 item: 4 setiap kategori) ---------- */
const SIMPULAN = [
  /* --- JARAK --- */
  {
    id: "jauh",
    sb: "Jauh",
    kategori: "jarak",
    makna: "Jarak yang tidak dekat, misalnya antara dua tempat yang berjauhan.",
    ayat: "Pasar raya itu jauh dari rumah saya.",
    gambar: "jauh"
  },
  {
    id: "dekat",
    sb: "Dekat",
    kategori: "jarak",
    makna: "Jarak yang tidak jauh, iaitu bersebelahan atau berhampiran sahaja.",
    ayat: "Sekolah saya dekat dengan rumah saya.",
    gambar: "dekat"
  },
  {
    id: "hampir",
    sb: "Hampir",
    kategori: "jarak",
    makna: "Tidak berapa jauh lagi; sudah sangat dekat dengan sesuatu tempat atau masa.",
    ayat: "Bas itu hampir sampai ke perhentian.",
    gambar: "hampir"
  },
  {
    id: "tinggi",
    sb: "Tinggi",
    kategori: "jarak",
    makna: "Jarak yang jauh dari bawah ke atas, misalnya bangunan atau pokok yang menjulang.",
    ayat: "Menara Kuala Lumpur sangat tinggi.",
    gambar: "tinggi"
  },
  /* --- PERASAAN --- */
  {
    id: "gembira",
    sb: "Gembira",
    kategori: "perasaan",
    makna: "Perasaan seronok dan suka hati apabila berlaku sesuatu yang baik.",
    ayat: "Aiman gembira kerana mendapat markah penuh.",
    gambar: "gembira"
  },
  {
    id: "sedih",
    sb: "Sedih",
    kategori: "perasaan",
    makna: "Perasaan pilu atau dukacita apabila berlaku sesuatu yang tidak menyenangkan.",
    ayat: "Siti sedih kerana kehilangan anak kucingnya.",
    gambar: "sedih"
  },
  {
    id: "marah",
    sb: "Marah",
    kategori: "perasaan",
    makna: "Perasaan berang atau tidak senang hati terhadap sesuatu perkara.",
    ayat: "Ayah marah kerana adik bermain api.",
    gambar: "marah"
  },
  {
    id: "takut",
    sb: "Takut",
    kategori: "perasaan",
    makna: "Perasaan gerun atau bimbang terhadap sesuatu yang dianggap bahaya.",
    ayat: "Aiman takut hendak masuk ke bilik yang gelap.",
    gambar: "takut"
  },
  /* --- PANCAINDERA --- */
  {
    id: "manis",
    sb: "Manis",
    kategori: "pancaindera",
    makna: "Rasa seperti gula atau madu yang dikesan melalui lidah.",
    ayat: "Kek coklat buatan ibu sangat manis.",
    gambar: "manis"
  },
  {
    id: "masam",
    sb: "Masam",
    kategori: "pancaindera",
    makna: "Rasa seperti limau mentah yang dikesan melalui lidah.",
    ayat: "Limau muda itu masam rasanya.",
    gambar: "masam"
  },
  {
    id: "sejuk",
    sb: "Sejuk",
    kategori: "pancaindera",
    makna: "Suhu yang rendah dan nyaman, dikesan melalui kulit.",
    ayat: "Air di dalam peti sejuk itu sangat sejuk.",
    gambar: "sejuk"
  },
  {
    id: "wangi",
    sb: "Wangi",
    kategori: "pancaindera",
    makna: "Bau yang harum dan menyenangkan, dikesan melalui hidung.",
    ayat: "Bunga mawar di taman itu berbau wangi.",
    gambar: "wangi"
  }
];

/* ---------- KUIZ INTERAKTIF (10 soalan aneka pilihan) ---------- */
const KUIZ = [
  {
    soalan: "\u201cRumah datuk sangat _______ dari bandar.\u201d Apakah kata adjektif yang sesuai?",
    pilihan: ["jauh", "manis", "gembira", "wangi"],
    jawapan: 0,
    petunjuk: "\u201cJauh\u201d ialah kata adjektif jarak — menerangkan kedudukan antara dua tempat."
  },
  {
    soalan: "Kata adjektif yang dikesan melalui LIDAH ialah \u2026",
    pilihan: ["wangi", "manis", "bising", "licin"],
    jawapan: 1,
    petunjuk: "\u201cManis\u201d ialah rasa yang dikesan oleh lidah — sejenis kata adjektif pancaindera."
  },
  {
    soalan: "\u201cAiman berasa _______ kerana mendapat markah penuh.\u201d",
    pilihan: ["sedih", "marah", "gembira", "takut"],
    jawapan: 2,
    petunjuk: "Mendapat markah penuh membuatkan seseorang berasa seronok — gembira."
  },
  {
    soalan: "Apakah kategori bagi kata adjektif \u201champir\u201d?",
    pilihan: ["Pancaindera", "Perasaan", "Jarak", "Bau"],
    jawapan: 2,
    petunjuk: "\u201cHampir\u201d menerangkan jarak — sudah sangat dekat dengan sesuatu tempat."
  },
  {
    soalan: "\u201cBunga mawar di taman itu berbau _______.\u201d",
    pilihan: ["masam", "wangi", "sejuk", "jauh"],
    jawapan: 1,
    petunjuk: "Bau bunga yang harum ialah \u201cwangi\u201d — dikesan melalui hidung."
  },
  {
    soalan: "Perasaan apabila kehilangan mainan kesayangan ialah \u2026",
    pilihan: ["gembira", "sedih", "marah", "manis"],
    jawapan: 1,
    petunjuk: "Kehilangan sesuatu yang disayangi membuatkan kita berasa pilu — sedih."
  },
  {
    soalan: "Kata adjektif \u201csejuk\u201d dikesan melalui \u2026",
    pilihan: ["hidung", "kulit", "lidah", "telinga"],
    jawapan: 1,
    petunjuk: "Suhu rendah dirasai oleh kulit — contohnya air dari peti sejuk."
  },
  {
    soalan: "Pilih AYAT yang BETUL.",
    pilihan: [
      "Kek itu wangi rasanya.",
      "Aiman jauh mendapat hadiah.",
      "Menara itu sangat tinggi.",
      "Ibu marah manis kepada saya."
    ],
    jawapan: 2,
    petunjuk: "\u201cTinggi\u201d menerangkan jarak dari bawah ke atas — ayat yang logik dan betul."
  },
  {
    soalan: "\u201cAdik _______ hendak berjumpa doktor gigi.\u201d",
    pilihan: ["takut", "wangi", "sejuk", "dekat"],
    jawapan: 0,
    petunjuk: "Perasaan gerun terhadap sesuatu ialah \u201ctakut\u201d — kata adjektif perasaan."
  },
  {
    soalan: "Apakah kategori bagi kata adjektif \u201cmasam\u201d?",
    pilihan: ["Jarak", "Perasaan", "Pancaindera", "Suhu"],
    jawapan: 2,
    petunjuk: "\u201cMasam\u201d ialah rasa yang dikesan lidah — sejenis kata adjektif pancaindera."
  }
];

/* ---------- PADANAN PINTAR (6 pasangan: kata → kategori) ---------- */
const PADANAN = [
  { kiri: "Jauh", kanan: "Jarak" },
  { kiri: "Gembira", kanan: "Perasaan" },
  { kiri: "Manis", kanan: "Pancaindera" },
  { kiri: "Dekat", kanan: "Jarak" },
  { kiri: "Marah", kanan: "Perasaan" },
  { kiri: "Wangi", kanan: "Pancaindera" }
];

/* ---------- LENGKAPKAN AYAT ---------- */
const LENGKAP = [
  {
    ayat: "Kek coklat itu terasa sangat ______ di lidah.",
    pilihan: ["manis", "masam", "sejuk", "jauh"],
    jawapan: 0
  },
  {
    ayat: "Pokok kelapa di hadapan rumah itu sangat ______.",
    pilihan: ["tinggi", "masam", "gembira", "wangi"],
    jawapan: 0
  },
  {
    ayat: "Farah berasa ______ kerana esok cuti sekolah.",
    pilihan: ["sedih", "marah", "gembira", "takut"],
    jawapan: 2
  },
  {
    ayat: "Air teh itu masih ______ kerana baru dikeluarkan dari peti sejuk.",
    pilihan: ["wangi", "sejuk", "manis", "dekat"],
    jawapan: 1
  },
  {
    ayat: "Pasar itu agak ______, jadi kita naik bas sahaja.",
    pilihan: ["jauh", "manis", "takut", "sejuk"],
    jawapan: 0
  }
];

/* ---------- CABARAN MINDA (3 aras: mudah / sederhana / sukar) ---------- */
const CABARAN = {
  mudah: [
    { soalan: "Kata adjektif bagi rasa gula ialah \u2026", pilihan: ["masam", "manis", "sejuk", "jauh"], jawapan: 1 },
    { soalan: "Lawan bagi kata adjektif \u201cjauh\u201d ialah \u2026", pilihan: ["tinggi", "wangi", "dekat", "sedih"], jawapan: 2 },
    { soalan: "\u201cIbu memasak kari, seluruh dapur berbau _______.\u201d", pilihan: ["wangi", "masam", "sejuk", "takut"], jawapan: 0 },
    { soalan: "Kata adjektif perasaan apabila mendapat hadiah ialah \u2026", pilihan: ["marah", "gembira", "manis", "hampir"], jawapan: 1 },
    { soalan: "\u201cAdik tidur awal kerana _______ tidur seorang diri.\u201d", pilihan: ["wangi", "dekat", "takut", "tinggi"], jawapan: 2 }
  ],
  sederhana: [
    { soalan: "Pilih AYAT yang BETUL.", pilihan: ["Bunga itu berbau wangi.", "Bunga itu berasa wangi.", "Bunga itu berjarak wangi.", "Bunga itu bertinggi wangi."], jawapan: 0 },
    { soalan: "Apakah kategori bagi kata adjektif \u201champir\u201d?", pilihan: ["Perasaan", "Pancaindera", "Jarak", "Ukuran"], jawapan: 2 },
    { soalan: "\u201cHati Siti _______ kerana kawan baiknya berpindah sekolah.\u201d", pilihan: ["gembira", "sedih", "masam", "sejuk"], jawapan: 1 },
    { soalan: "Kata adjektif yang dikesan melalui KULIT ialah \u2026", pilihan: ["wangi", "manis", "sejuk", "jauh"], jawapan: 2 },
    { soalan: "\u201cMenara itu sangat _______ sehingga hampir mencecah awan.\u201d", pilihan: ["tinggi", "dekat", "manis", "gembira"], jawapan: 0 }
  ],
  sukar: [
    { soalan: "Pilih AYAT yang betul menggunakan kata adjektif \u201cmasam\u201d.", pilihan: ["Limau muda itu masam rasanya.", "Adik masam menonton televisyen.", "Jalan itu masam dan berdebu.", "Ibu masam ke pasar pagi tadi."], jawapan: 0 },
    { soalan: "Pilih pasangan kata adjektif dan kategori yang SALAH.", pilihan: ["jauh — jarak", "gembira — perasaan", "manis — jarak", "wangi — pancaindera"], jawapan: 2 },
    { soalan: "\u201cBas itu sudah _______ sampai, kita bersiap-siaplah di pintu.\u201d", pilihan: ["sejuk", "hampir", "wangi", "sedih"], jawapan: 1 },
    { soalan: "Kata adjektif yang TIDAK menggambarkan perasaan ialah \u2026", pilihan: ["gembira", "sedih", "manis", "takut"], jawapan: 2 },
    { soalan: "\u201c_______ dan _______ ialah kata adjektif jarak.\u201d", pilihan: ["jauh, dekat", "manis, masam", "gembira, sedih", "wangi, sejuk"], jawapan: 0 }
  ]
};

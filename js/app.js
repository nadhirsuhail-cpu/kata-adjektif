/* =========================================================
   KEMBARA SIMPULAN BAHASA — Logik Aplikasi
   Log masuk (guru/murid), navigasi mengikut peranan, narasi
   audio, 4 permainan, profil & rekod pencapaian, papan pemuka
   guru, mod gelap dan alat kebolehcapaian.
   ========================================================= */
"use strict";

/* ---------- Utiliti ---------- */
const $ = (s, ctx) => (ctx || document).querySelector(s);
const $$ = (s, ctx) => Array.from((ctx || document).querySelectorAll(s));
const abjad = ["A", "B", "C", "D"];

/* =========================================================
   SESI & PROFIL (localStorage)
   ========================================================= */
let sesi = null; // { peranan: "guru"|"murid", nama, avatar }

function muatSesi() {
  try { sesi = JSON.parse(localStorage.getItem("ksb-sesi") || "null"); }
  catch { sesi = null; }
}
function simpanSesi() {
  try { localStorage.setItem("ksb-sesi", JSON.stringify(sesi)); } catch { /* abaikan */ }
}
function profilAktif() { return sesi ? sesi.nama : "tetamu"; }
function kunciProfil() { return "ksb-profil-" + profilAktif(); }

const stor = {
  baca() {
    try { return JSON.parse(localStorage.getItem(kunciProfil()) || "{}"); }
    catch { return {}; }
  },
  tulis(obj) {
    try { localStorage.setItem(kunciProfil(), JSON.stringify(obj)); }
    catch { /* mod persendirian — abaikan */ }
  }
};

function senaraiProfilMurid() {
  const out = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("ksb-profil-") && k !== "ksb-profil-guru") {
        out.push({ nama: k.slice(11), rekod: JSON.parse(localStorage.getItem(k) || "{}") });
      }
    }
  } catch { /* abaikan */ }
  return out;
}

/* =========================================================
   TEMA (terang / gelap)
   ========================================================= */
function muatTema() {
  let tema = null;
  try { tema = localStorage.getItem("ksb-tema"); } catch { /* abaikan */ }
  if (!tema) tema = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "gelap" : "terang";
  document.documentElement.dataset.tema = tema;
  kemasTemaButang();
}
function tukarTema() {
  const kini = document.documentElement.dataset.tema === "gelap" ? "terang" : "gelap";
  document.documentElement.dataset.tema = kini;
  try { localStorage.setItem("ksb-tema", kini); } catch { /* abaikan */ }
  kemasTemaButang();
}
function kemasTemaButang() {
  const gelap = document.documentElement.dataset.tema === "gelap";
  const ikon = gelap ? "#ikon-matahari" : "#ikon-bulan";
  const b1 = $("#btnTema"), b2 = $("#btnTemaMasuk");
  if (b1) b1.innerHTML = `<svg class="ikon"><use href="${ikon}"/></svg>`;
  if (b2) b2.innerHTML = `<svg class="ikon"><use href="${ikon}"/></svg>`;
}

/* =========================================================
   NARASI AUDIO (Web Speech API — bahasa Melayu)
   ========================================================= */
let narasiHidup = true;
function sebut(teks, kadar = 0.95) {
  if (!narasiHidup) return;
  if (!("speechSynthesis" in window)) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(teks);
    u.lang = "ms-MY";
    u.rate = kadar;
    u.pitch = 1.04;
    speechSynthesis.speak(u);
  } catch { /* sokongan tiada — abaikan */ }
}

/* =========================================================
   LOG MASUK / LOG KELUAR
   ========================================================= */
function bukaKeping(keping) {
  $$(".keping").forEach(k => { k.hidden = true; });
  keping.hidden = false;
  const input = $("input", keping);
  if (input) setTimeout(() => input.focus(), 80);
}
function tutupKeping() { $$(".keping").forEach(k => { k.hidden = true; }); }

$("#btnMasukGuru").addEventListener("click", () => {
  $("#ralatGuru").hidden = true;
  $("#logGuruPass").value = "";
  bukaKeping($("#kepingGuru"));
});
$("#btnMasukMurid").addEventListener("click", () => {
  $("#ralatMurid").hidden = true;
  $("#logMuridNama").value = "";
  pilihAvatar = 0;
  renderAvatar();
  bukaKeping($("#kepingMurid"));
});
$$("[data-tutup]").forEach(b => b.addEventListener("click", tutupKeping));
$$(".keping").forEach(k => k.addEventListener("click", (e) => { if (e.target === k) tutupKeping(); }));

/* --- Avatar murid (bulatan gradien) --- */
let pilihAvatar = 0;
function renderAvatar() {
  $("#avatarGrid").innerHTML = AVATAR.map((w, i) => {
    const sel = i === pilihAvatar;
    return `<button type="button" class="avatar-pilih ${sel ? "is-pilih" : ""}" data-i="${i}"
      aria-label="Warna avatar ${i + 1}" aria-pressed="${sel}" style="--av1:${w[0]};--av2:${w[1]}">
      <span class="avatar-warna">${sel ? '<svg class="ikon"><use href="#ikon-semak"/></svg>' : ""}</span>
    </button>`;
  }).join("");
  $$("#avatarGrid .avatar-pilih").forEach(b => b.addEventListener("click", () => {
    pilihAvatar = Number(b.dataset.i);
    renderAvatar();
  }));
}

/* --- HTML avatar semasa (cip pengguna, papan pemuka) --- */
function avatarHTML(peranan, indeks, nama) {
  if (peranan === "guru") {
    return '<span class="avatar-warna" style="--av1:#0071e3;--av2:#7cb8ff">G</span>';
  }
  const w = AVATAR[Number(indeks)] || AVATAR[0];
  const aksara = nama ? escapeHtml(nama[0].toUpperCase()) : "";
  return `<span class="avatar-warna" style="--av1:${w[0]};--av2:${w[1]}">${aksara}</span>`;
}

/* --- Masuk guru --- */
$("#formGuru").addEventListener("submit", (e) => {
  e.preventDefault();
  const pass = $("#logGuruPass").value.trim();
  if (pass === LOGIN.guruPass) {
    sesi = { peranan: "guru", nama: LOGIN.namaGuru, avatar: -1 };
    simpanSesi();
    tutupKeping();
    masukAplikasi();
  } else {
    $("#ralatGuru").hidden = false;
    $("#logGuruPass").value = "";
    $("#logGuruPass").focus();
  }
});

/* --- Masuk murid --- */
$("#formMurid").addEventListener("submit", (e) => {
  e.preventDefault();
  const nama = $("#logMuridNama").value.trim().replace(/\s+/g, " ");
  if (!nama) {
    $("#ralatMurid").hidden = false;
    $("#logMuridNama").focus();
    return;
  }
  sesi = { peranan: "murid", nama: nama, avatar: pilihAvatar };
  simpanSesi();
  tutupKeping();
  masukAplikasi();
});

/* --- Keluar --- */
$("#btnKeluar").addEventListener("click", () => {
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  sesi = null;
  simpanSesi();
  $("#aplikasi").hidden = true;
  $("#layarMasuk").hidden = false;
  window.scrollTo({ top: 0 });
});

/* =========================================================
   MASUK APLIKASI (render ikut peranan)
   ========================================================= */
function masukAplikasi() {
  const guru = sesi.peranan === "guru";
  $("#layarMasuk").hidden = true;
  $("#aplikasi").hidden = false;

  // Cip pengguna
  $("#cipAvatar").innerHTML = avatarHTML(sesi.peranan, sesi.avatar, sesi.nama);
  $("#cipNama").textContent = sesi.nama;
  $("#cipPeranan").textContent = guru ? "Guru" : "Murid";
  $("#brandSub").textContent = guru ? "Paparan Guru · EDUP3133" : "BM Tahun 3 · EDUP3133";

  // Salam hero murid
  if (!guru) $("#salamHero").textContent = "Hai, " + sesi.nama.split(" ")[0];

  // Navigasi mengikut peranan
  const NAV = guru
    ? [["dash", "Papan Pemuka"], ["belajar", "Pratinjau Murid"], ["permainan", "Permainan"], ["zon3d", "Zon 3D & AR"], ["guru", "Panduan Guru"], ["assure", "Model ASSURE"], ["rujukan", "Rujukan"]]
    : [["home", "Utama"], ["belajar", "Mari Belajar"], ["permainan", "Permainan"], ["zon3d", "Zon 3D & AR"]];
  $("#mainNav").innerHTML = NAV.map(([id, label]) =>
    `<button class="nav-btn" data-nav="${id}">${label}</button>`).join("");

  const pertama = guru ? "dash" : "home";
  pindahSkrin(pertama);
  renderPelajaran();
  renderPencapaian();
  if (guru) renderDash();
  window.scrollTo({ top: 0 });

  if (guru) {
    sebut("Selamat datang ke papan pemuka guru.");
  } else {
    sebut("Hai " + sesi.nama.split(" ")[0] + "! Selamat kembali ke Kembara Kata Adjektif.");
  }
}

/* =========================================================
   NAVIGASI SKRIN
   ========================================================= */
function pindahSkrin(nama) {
  // "utama" = skrin pertama mengikut peranan
  if (nama === "utama") nama = (sesi && sesi.peranan === "guru") ? "dash" : "home";

  $$(".screen").forEach(s => {
    const aktif = s.id === "screen-" + nama;
    s.classList.toggle("is-active", aktif);
    s.hidden = !aktif;
  });
  $$(".nav-btn").forEach(b => b.classList.toggle("is-active", b.dataset.nav === nama));
  if (nama === "permainan") bukaTab("kuiz");
  if (nama === "zon3d") muatEnjin3D();
  skrinMemuat(nama);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("click", (e) => {
  const nav = e.target.closest("[data-nav]");
  if (nav) pindahSkrin(nav.dataset.nav);
});

/* =========================================================
   SKELETON SHIMMER
   ========================================================= */
function skeletonKad(n) {
  return Array.from({ length: n }, () => '<div class="skeleton skeleton-kad"></div>').join("");
}
function skeletonTeks(n) {
  return Array.from({ length: n }, () => '<div class="skeleton skeleton-teks"></div>').join("");
}
function skrinMemuat(seksyen) {
  const s = document.getElementById("screen-" + seksyen);
  if (!s) return;
  if (document.documentElement.classList.contains("no-anim")) return;
  if ($(".skeleton-lapisan", s)) return;
  const lap = document.createElement("div");
  lap.className = "skeleton-lapisan";
  lap.setAttribute("aria-hidden", "true");
  lap.innerHTML = '<div class="skeleton skeleton-tajuk"></div>' +
                  '<div class="skeleton skeleton-bar"></div>' +
                  '<div class="skeleton skeleton-bar" style="width:64%"></div>' +
                  '<div class="skeleton-grid">' + skeletonKad(4) + "</div>";
  s.appendChild(lap);
  setTimeout(() => lap.remove(), 420);
}

/* =========================================================
   BAR AKSESIBILITI
   ========================================================= */
const rootHtml = document.documentElement;
let saizFont = 0; // 0 | 1 (font-lg) | 2 (font-xl)

/* ---------- Kesan ripple pada butang ---------- */
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn, .nav-btn, .tab-btn");
  if (!btn) return;
  if (rootHtml.classList.contains("no-anim")) return;
  const r = btn.getBoundingClientRect();
  const riak = document.createElement("span");
  riak.className = "ripple";
  riak.setAttribute("aria-hidden", "true");
  const saiz = Math.max(r.width, r.height);
  riak.style.width = riak.style.height = saiz + "px";
  riak.style.left = (e.clientX - r.left - saiz / 2) + "px";
  riak.style.top = (e.clientY - r.top - saiz / 2) + "px";
  btn.appendChild(riak);
  riak.addEventListener("animationend", () => riak.remove());
});

$("#btnA11y").addEventListener("click", () => {
  const bar = $("#barA11y");
  bar.hidden = !bar.hidden;
  $("#btnA11y").setAttribute("aria-expanded", String(!bar.hidden));
});

function setSaiz() {
  rootHtml.classList.toggle("font-lg", saizFont === 1);
  rootHtml.classList.toggle("font-xl", saizFont === 2);
}
$("#btnFontMin").addEventListener("click", () => { saizFont = Math.max(0, saizFont - 1); setSaiz(); });
$("#btnFontPlus").addEventListener("click", () => { saizFont = Math.min(2, saizFont + 1); setSaiz(); });

function togolPill(btn, klas, teksHidup, teksMati) {
  const on = rootHtml.classList.toggle(klas);
  btn.setAttribute("aria-pressed", String(on));
  btn.textContent = on ? teksHidup : teksMati;
  btn.classList.toggle("is-on", on);
}
$("#btnDys").addEventListener("click", (e) => togolPill(e.currentTarget, "dyslexic", "Fon Mesra Disleksia: Hidup", "Fon Mesra Disleksia"));
$("#btnKontras").addEventListener("click", (e) => togolPill(e.currentTarget, "kontras", "Kontras Tinggi: Hidup", "Kontras Tinggi"));
$("#btnAnimasi").addEventListener("click", (e) => togolPill(e.currentTarget, "no-anim", "Animasi Dikurangkan", "Kurangkan Animasi"));
$("#btnNarasi").addEventListener("click", (e) => {
  narasiHidup = !narasiHidup;
  const b = e.currentTarget;
  b.setAttribute("aria-pressed", String(narasiHidup));
  b.textContent = narasiHidup ? "Narasi Audio: Hidup" : "Narasi Audio: Mati";
  b.classList.toggle("is-on", narasiHidup);
  if (!narasiHidup && "speechSynthesis" in window) speechSynthesis.cancel();
});
$("#btnCubaNarasi").addEventListener("click", () =>
  sebut("Selamat datang ke Kembara Kata Adjektif! Saya Si Cendekia, rakan kembara kamu. Jom belajar kata adjektif jarak, perasaan dan pancaindera sambil bermain!"));

/* Tema */
$("#btnTema").addEventListener("click", tukarTema);
$("#btnTemaMasuk").addEventListener("click", tukarTema);

/* =========================================================
   MARI BELAJAR
   ========================================================= */
function ikonSVG(id) {
  return '<svg viewBox="0 0 200 160" aria-hidden="true"><use href="#svg-' + id + '"/></svg>';
}

function renderPelajaran() {
  const grid = $("#gridPelajaran");
  const rekod = stor.baca();
  const turutan = ["jarak", "perasaan", "pancaindera"];
  let html = "";
  turutan.forEach(kat => {
    const items = SIMPULAN.filter(x => x.kategori === kat);
    const k = KATEGORI[kat];
    html += `<div class="kumpulan-pelajaran" style="--warna-kat:${k.warna}">
      <div class="kumpulan-kepala">
        <h2>${k.nama}</h2>
        <p>${k.huraian}</p>
      </div>
      <div class="kad-grid pelajaran">` + items.map(item => {
        const idx = SIMPULAN.indexOf(item);
        return `<article class="kad-pelajaran" tabindex="0" role="button"
          data-idx="${idx}" aria-label="Pelajari kata adjektif: ${item.sb}">
          <span class="tag-kategori">${k.nama}</span>
          ${ikonSVG(item.gambar)}
          <h3>${item.sb}</h3>
          <p class="tag-makna">Klik untuk belajar →</p>
          <p class="status-kad ${rekod.pelajaran && rekod.pelajaran[idx] ? "sudah" : ""}">
            ${rekod.pelajaran && rekod.pelajaran[idx] ? "Sudah diteroka" : "Belum diteroka"}
          </p>
        </article>`;
      }).join("") + `</div></div>`;
  });
  grid.innerHTML = html;

  $$(".kad-pelajaran", grid).forEach(kad => {
    const buka = () => bukaModal(Number(kad.dataset.idx));
    kad.addEventListener("click", buka);
    kad.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); buka(); }
    });
  });
}

let idxModal = 0;

function bukaModal(idx) {
  idxModal = idx;
  const item = SIMPULAN[idx];
  const k = KATEGORI[item.kategori] || KATEGORI.jarak;
  $("#modalTajuk").textContent = item.sb;
  $("#modalKategori").textContent = "Kata adjektif " + k.nama.toLowerCase();
  $("#modalKategori").style.color = k.warna;
  $("#modalGambar").innerHTML = ikonSVG(item.gambar);
  $("#modalMakna").hidden = true;
  $("#modalMaknaTeks").textContent = item.makna;
  $("#btnTunjukMakna").hidden = false;
  $("#modalAyat").hidden = true;
  $("#modalAyatTeks").textContent = item.ayat;
  $("#modalPosisi").textContent = (idx + 1) + " / " + SIMPULAN.length;
  $("#modalPelajaran").hidden = false;
  sebut("Kata adjektif " + item.sb + ". Tekan Lihat Makna untuk mengetahui maksudnya.");
  $("#btnTunjukMakna").focus();
}

function tutupModal() {
  $("#modalPelajaran").hidden = true;
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  tandakanDiteroka();
}

function tandakanDiteroka() {
  const rekod = stor.baca();
  rekod.pelajaran = rekod.pelajaran || {};
  rekod.pelajaran[idxModal] = true;
  stor.tulis(rekod);
  renderPelajaran();
  renderPencapaian();
}

$("#modalTutup").addEventListener("click", tutupModal);
$("#modalPelajaran").addEventListener("click", (e) => { if (e.target === $("#modalPelajaran")) tutupModal(); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!$("#modalPelajaran").hidden) tutupModal();
    else tutupKeping();
  }
});

$("#btnTunjukMakna").addEventListener("click", () => {
  $("#modalMakna").hidden = false;
  $("#btnTunjukMakna").hidden = true;
  $("#modalAyat").hidden = false;
  sebut(SIMPULAN[idxModal].sb + " bermaksud: " + SIMPULAN[idxModal].makna);
});
$("#btnDengarAyat").addEventListener("click", () => sebut(SIMPULAN[idxModal].ayat, 0.9));
$("#btnSebelum").addEventListener("click", () => bukaModal((idxModal - 1 + SIMPULAN.length) % SIMPULAN.length));
$("#btnSeterusnya").addEventListener("click", () => bukaModal((idxModal + 1) % SIMPULAN.length));

/* =========================================================
   TAB PERMAINAN
   ========================================================= */
function bukaTab(nama) {
  $$(".tab-btn").forEach(b => {
    const on = b.dataset.tab === nama;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-selected", String(on));
  });
  $$(".tab-panel").forEach(p => {
    const on = p.id === "panel-" + nama;
    p.classList.toggle("is-active", on);
    p.hidden = !on;
  });
}
$$(".tab-btn").forEach(b => b.addEventListener("click", () => bukaTab(b.dataset.tab)));

/* =========================================================
   KUIZ INTERAKTIF
   ========================================================= */
let kuizNo = 0, kuizSkor = 0, kuizTerkunci = false;

function mulaKuiz() {
  kuizNo = 0; kuizSkor = 0;
  $("#kuizMula").hidden = true;
  $("#kuizTamat").hidden = true;
  $("#kuizMain").hidden = false;
  paparSoalanKuiz();
}
$("#btnMulaKuiz").addEventListener("click", () => { mulaKuiz(); sebut("Mula kuiz. Semoga berjaya!"); });

function paparSoalanKuiz() {
  const q = KUIZ[kuizNo];
  kuizTerkunci = false;
  $("#kuizPosisi").textContent = "Soalan " + (kuizNo + 1) + " / " + KUIZ.length;
  $("#kuizProgress").style.width = (kuizNo / KUIZ.length * 100) + "%";
  $("#kuizSoalan").textContent = q.soalan;
  $("#kuizPetunjuk").hidden = true;
  $("#kuizStatus").textContent = "";
  $("#kuizStatus").className = "maklum-status";
  sebut(q.soalan);
  $("#kuizPilihan").innerHTML = q.pilihan.map((p, i) =>
    `<button data-i="${i}"><span class="abjad">${abjad[i]}</span><span>${p}</span></button>`).join("");
  $$("#kuizPilihan button").forEach(b => b.addEventListener("click", () => jawabKuiz(Number(b.dataset.i))));
}

function jawabKuiz(i) {
  if (kuizTerkunci) return;
  kuizTerkunci = true;
  const q = KUIZ[kuizNo];
  const butang = $$("#kuizPilihan button");
  const status = $("#kuizStatus");
  butang.forEach((b, j) => {
    b.disabled = true;
    if (j === q.jawapan) b.classList.add("betul");
    else if (j === i) b.classList.add("salah");
  });
  if (i === q.jawapan) {
    kuizSkor++;
    status.textContent = "Betul. " + q.petunjuk;
    status.className = "maklum-status betul";
    sebut("Betul! Syabas!");
  } else {
    status.textContent = "Belum tepat. " + q.petunjuk;
    status.className = "maklum-status salah";
    $("#kuizPetunjuk").hidden = false;
    $("#kuizPetunjuk").textContent = "Petunjuk: " + q.petunjuk;
    sebut("Belum tepat. " + q.petunjuk);
  }
  setTimeout(() => {
    if (kuizNo + 1 < KUIZ.length) { kuizNo++; paparSoalanKuiz(); }
    else tamatKuiz();
  }, 2600);
}

function tamatKuiz() {
  $("#kuizMain").hidden = true;
  $("#kuizTamat").hidden = false;
  $("#kuizProgress").style.width = "100%";
  const skor = kuizSkor;
  let jenisLencana, warnaLencana, tajuk, mesej;
  if (skor === 10) { jenisLencana = "ikon-pingat"; warnaLencana = "#f5b301"; tajuk = "Bintang Emas."; mesej = "Sempurna! Kamu memang panjang akal."; }
  else if (skor >= 8) { jenisLencana = "ikon-pingat"; warnaLencana = "#a8a8b0"; tajuk = "Bintang Perak."; mesej = "Hebat! Hampir sempurna. Ulang kaji sedikit lagi."; }
  else if (skor >= 6) { jenisLencana = "ikon-pingat"; warnaLencana = "#cd7f32"; tajuk = "Bintang Gangsa."; mesej = "Bagus! Teruskan berlatih di Mari Belajar."; }
  else { jenisLencana = "ikon-menaik"; warnaLencana = "currentColor"; tajuk = "Teruskan Usaha."; mesej = "Jangan putus asa! Kembali ke Mari Belajar dan cuba lagi."; }
  $("#kuizLencana").innerHTML = `<svg class="ikon-lencana" style="color:${warnaLencana}"><use href="#${jenisLencana}"/></svg>`;
  $("#kuizTajukTamat").textContent = tajuk;
  $("#kuizSkorTamat").textContent = skor + " / 10";
  $("#kuizMesejTamat").textContent = mesej;
  sebut(tajuk + " Kamu mendapat " + skor + " daripada 10.");
  const rekod = stor.baca();
  rekod.kuizTerbaik = Math.max(rekod.kuizTerbaik || 0, skor);
  stor.tulis(rekod);
  renderPencapaian();
}
$("#btnUlangKuiz").addEventListener("click", mulaKuiz);

/* =========================================================
   PADANAN PINTAR
   ========================================================= */
let padananPilihKiri = null;
const abjadPadanan = ["A", "B", "C", "D", "E", "F"];
function susunRawak(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function mulaPadanan() {
  padananPilihKiri = null;
  $("#padananTamat").hidden = true;
  $("#padananStatus").textContent = "Pilih satu kad di kiri, kemudian satu kad di kanan.";
  $("#padananStatus").className = "maklum-status";
  const kiriSusunan = susunRawak(PADANAN.map((p, i) => ({ teks: p.kiri, id: i })));
  const kananSusunan = susunRawak(PADANAN.map((p, i) => ({ teks: p.kanan, id: i })));
  $("#padananKiri").innerHTML = kiriSusunan.map(k =>
    `<button class="padanan-kad" data-id="${k.id}">${k.teks}</button>`).join("");
  $("#padananKanan").innerHTML = kananSusunan.map(k =>
    `<button class="padanan-kad" data-id="${k.id}">${k.teks}</button>`).join("");
  $$("#padananKiri .padanan-kad").forEach(b => b.addEventListener("click", () => pilihKiri(b)));
  $$("#padananKanan .padanan-kad").forEach(b => b.addEventListener("click", () => pilihKanan(b)));
}

function pilihKiri(btn) {
  if (btn.disabled) return;
  $$("#padananKiri .padanan-kad").forEach(b => b.classList.remove("dipilih"));
  btn.classList.add("dipilih");
  padananPilihKiri = btn;
  sebut(btn.textContent.trim());
  const status = $("#padananStatus");
  status.textContent = "Sekarang pilih maknanya di sebelah kanan.";
  status.className = "maklum-status";
}

function pilihKanan(btn) {
  const status = $("#padananStatus");
  if (!padananPilihKiri) {
    status.textContent = "Pilih kata adjektif di sebelah kiri dahulu ya!";
    status.className = "maklum-status";
    sebut("Pilih kata adjektif di sebelah kiri dahulu.");
    return;
  }
  if (btn.disabled) return;
  const idKiri = Number(padananPilihKiri.dataset.id);
  const idKanan = Number(btn.dataset.id);
  if (idKiri === idKanan) {
    padananPilihKiri.classList.remove("dipilih");
    padananPilihKiri.classList.add("betul");
    padananPilihKiri.disabled = true;
    btn.classList.add("betul");
    btn.disabled = true;
    padananPilihKiri = null;
    status.textContent = "Betul. " + PADANAN[idKiri].kiri + " = " + PADANAN[idKiri].kanan;
    status.className = "maklum-status betul";
    sebut("Betul! " + PADANAN[idKiri].kiri + " bermaksud " + PADANAN[idKiri].kanan);
    if ($$("#padananKiri .padanan-kad:not(:disabled)").length === 0) {
      $("#padananTamat").hidden = false;
      const rekod = stor.baca();
      rekod.padananSiap = true;
      stor.tulis(rekod);
      renderPencapaian();
      sebut("Tahniah! Semua pasangan berjaya dipadankan!");
    }
  } else {
    btn.classList.add("salah-sekejap");
    padananPilihKiri.classList.add("salah-sekejap");
    status.textContent = "Belum padan. Cuba sekali lagi!";
    status.className = "maklum-status salah";
    setTimeout(() => {
      btn.classList.remove("salah-sekejap");
      padananPilihKiri.classList.remove("salah-sekejap", "dipilih");
      padananPilihKiri = null;
    }, 500);
  }
}
$("#btnUlangPadanan").addEventListener("click", mulaPadanan);

/* =========================================================
   LENGKAPKAN AYAT
   ========================================================= */
let lengkapSelesai = 0;
function mulaLengkap() {
  lengkapSelesai = 0;
  $("#lengkapTamat").hidden = true;
  $("#lengkapStatus").textContent = "";
  $("#lengkapStatus").className = "maklum-status";
  $("#lengkapList").innerHTML = LENGKAP.map((item, i) => `
    <div class="lengkap-item" id="lengkap-${i}">
      <p class="lengkap-ayat">${i + 1}. ${item.ayat.replace("______", '<span class="kosong" id="kosong-' + i + '">?</span>')}</p>
      <div class="lengkap-pilihan" id="pilih-${i}">
        ${susunRawak(item.pilihan.map((p, j) => `<button data-j="${j}">${p}</button>`)).join("")}
      </div>
    </div>`).join("");
  LENGKAP.forEach((item, i) => {
    $$("#pilih-" + i + " button").forEach(b => b.addEventListener("click", () => {
      const j = Number(b.dataset.j);
      const kosong = $("#kosong-" + i);
      kosong.textContent = item.pilihan[j];
      if (j === item.jawapan) {
        $("#lengkap-" + i).classList.add("selesai");
        $$("#pilih-" + i + " button").forEach(x => x.disabled = true);
        lengkapSelesai++;
        $("#lengkapStatus").textContent = "Betul! (" + lengkapSelesai + "/" + LENGKAP.length + ")";
        $("#lengkapStatus").className = "maklum-status betul";
        sebut("Betul! Syabas!");
      } else {
        $("#lengkapStatus").textContent = "Cuba pilihan lain.";
        $("#lengkapStatus").className = "maklum-status salah";
        setTimeout(() => { kosong.textContent = "?"; }, 600);
      }
      if (lengkapSelesai === LENGKAP.length) {
        $("#lengkapTamat").hidden = false;
        $("#lengkapMesejTamat").textContent = "Kamu berjaya melengkapkan semua " + LENGKAP.length + " ayat dengan betul!";
        const rekod = stor.baca();
        rekod.lengkapSiap = true;
        stor.tulis(rekod);
        renderPencapaian();
        sebut("Tahniah! Semua ayat dilengkapkan dengan betul!");
      }
    }));
  });
}
$("#btnUlangLengkap").addEventListener("click", mulaLengkap);

/* =========================================================
   CABARAN MINDA
   ========================================================= */
let cabaranArasAktif = "mudah", cabaranNo = 0, cabaranSkor = 0, cabaranTerkunci = false;

function mulaCabaran(aras) {
  cabaranArasAktif = aras;
  cabaranNo = 0; cabaranSkor = 0;
  $("#cabaranMula").hidden = true;
  $("#cabaranTamat").hidden = true;
  $("#cabaranMain").hidden = false;
  paparSoalanCabaran();
}
$$(".aras-btn").forEach(b => b.addEventListener("click", () => {
  mulaCabaran(b.dataset.aras);
  sebut("Cabaran aras " + b.dataset.aras + " bermula!");
}));

function paparSoalanCabaran() {
  const set = CABARAN[cabaranArasAktif];
  const q = set[cabaranNo];
  cabaranTerkunci = false;
  $("#cabaranAras").textContent = "Aras: " + (cabaranArasAktif === "mudah" ? "Mudah" : cabaranArasAktif === "sederhana" ? "Sederhana" : "Sukar");
  $("#cabaranPosisi").textContent = "Soalan " + (cabaranNo + 1) + " / " + set.length;
  $("#cabaranProgress").style.width = (cabaranNo / set.length * 100) + "%";
  $("#cabaranSoalan").textContent = q.soalan;
  $("#cabaranStatus").textContent = "";
  $("#cabaranStatus").className = "maklum-status";
  sebut(q.soalan);
  $("#cabaranPilihan").innerHTML = q.pilihan.map((p, i) =>
    `<button data-i="${i}"><span class="abjad">${abjad[i]}</span><span>${p}</span></button>`).join("");
  $$("#cabaranPilihan button").forEach(b => b.addEventListener("click", () => jawabCabaran(Number(b.dataset.i))));
}

function jawabCabaran(i) {
  if (cabaranTerkunci) return;
  cabaranTerkunci = true;
  const q = CABARAN[cabaranArasAktif][cabaranNo];
  const butang = $$("#cabaranPilihan button");
  const status = $("#cabaranStatus");
  butang.forEach((b, j) => {
    b.disabled = true;
    if (j === q.jawapan) b.classList.add("betul");
    else if (j === i) b.classList.add("salah");
  });
  if (i === q.jawapan) {
    cabaranSkor++;
    status.textContent = "Betul!";
    status.className = "maklum-status betul";
    sebut("Betul!");
  } else {
    status.textContent = "Belum tepat. Jawapan betul ditandakan hijau.";
    status.className = "maklum-status salah";
  }
  setTimeout(() => {
    if (cabaranNo + 1 < CABARAN[cabaranArasAktif].length) { cabaranNo++; paparSoalanCabaran(); }
    else tamatCabaran();
  }, 2200);
}

function tamatCabaran() {
  $("#cabaranMain").hidden = true;
  $("#cabaranTamat").hidden = false;
  $("#cabaranProgress").style.width = "100%";
  const skor = cabaranSkor, penuh = CABARAN[cabaranArasAktif].length;
  const trofi = skor === penuh;
  $("#cabaranLencana").innerHTML = trofi
    ? '<svg class="ikon-lencana" style="color:#f5b301"><use href="#ikon-trofi"/></svg>'
    : '<svg class="ikon-lencana"><use href="#ikon-menaik"/></svg>';
  $("#cabaranTajukTamat").textContent = "Aras " + (cabaranArasAktif === "mudah" ? "Mudah" : cabaranArasAktif === "sederhana" ? "Sederhana" : "Sukar") + " Selesai.";
  $("#cabaranSkorTamat").textContent = skor + " / " + penuh;
  $("#cabaranMesejTamat").textContent = skor === penuh ? "Sempurna! Naik ke aras seterusnya, juara." : "Bagus! Cuba aras lain pula.";
  sebut("Cabaran selesai. Skor kamu " + skor + " daripada " + penuh + ".");
  const rekod = stor.baca();
  rekod.cabaran = rekod.cabaran || {};
  rekod.cabaran[cabaranArasAktif] = Math.max(rekod.cabaran[cabaranArasAktif] || 0, skor);
  stor.tulis(rekod);
  renderPencapaian();
}
$("#btnUlangCabaran").addEventListener("click", () => {
  $("#cabaranTamat").hidden = true;
  $("#cabaranMula").hidden = false;
});

/* =========================================================
   PENCAPAIAN SAYA
   ========================================================= */
function renderPencapaian() {
  const rekod = stor.baca();
  const item = (label, nilai) => `<div class="pencapaian-item"><span>${label}</span><span>${nilai}</span></div>`;
  let html = "";
  html += item("Kuiz Terbaik", rekod.kuizTerbaik != null ? rekod.kuizTerbaik + " / 10" : "—");
  html += item("Padanan Pintar", rekod.padananSiap ? "Selesai" : "—");
  html += item("Lengkapkan Ayat", rekod.lengkapSiap ? "Selesai" : "—");
  html += item("Cabaran (M/S/S)",
    [rekod.cabaran && rekod.cabaran.mudah, rekod.cabaran && rekod.cabaran.sederhana, rekod.cabaran && rekod.cabaran.sukar]
      .map(x => x != null ? x : "—").join(" / "));
  html += item("Kad Diteroka", (rekod.pelajaran ? Object.keys(rekod.pelajaran).length : 0) + " / " + SIMPULAN.length);
  $("#panelPencapaian").innerHTML = html;
}

/* =========================================================
   PAPAN PEMUKA GURU
   ========================================================= */
function renderDash() {
  const profil = senaraiProfilMurid();
  const jum = profil.length;
  const skorKuiz = profil.map(p => p.rekod.kuizTerbaik).filter(x => x != null);
  const purataKuiz = skorKuiz.length ? (skorKuiz.reduce((a, b) => a + b, 0) / skorKuiz.length).toFixed(1) : "—";
  const padananSiap = profil.filter(p => p.rekod.padananSiap).length;
  const lengkapSiap = profil.filter(p => p.rekod.lengkapSiap).length;

  $("#dashStat").innerHTML = `
    <article class="kad kad-stat"><p class="stat-angka">${jum}</p><p class="stat-label">Murid Berdaftar</p></article>
    <article class="kad kad-stat"><p class="stat-angka">${purataKuiz}</p><p class="stat-label">Purata Kuiz Terbaik</p></article>
    <article class="kad kad-stat"><p class="stat-angka">${padananSiap}</p><p class="stat-label">Selesai Padanan</p></article>
    <article class="kad kad-stat"><p class="stat-angka">${lengkapSiap}</p><p class="stat-label">Selesai Lengkapkan Ayat</p></article>`;

  $("#dashMurid").innerHTML = profil.length
    ? profil.map(p => {
        const r = p.rekod;
        const kadDiteroka = r.pelajaran ? Object.keys(r.pelajaran).length : 0;
        const cab = r.cabaran ? [r.cabaran.mudah, r.cabaran.sederhana, r.cabaran.sukar].map(x => x != null ? x : "—").join(" / ") : "—";
        return `<div class="baris-murid">
          <span class="cip-avatar" aria-hidden="true">${profilAvatar(p.nama)}</span>
          <span class="bm-nama">${escapeHtml(p.nama)}</span>
          <span class="bm-skima">Kuiz: ${r.kuizTerbaik != null ? r.kuizTerbaik + "/10" : "—"} · Padanan: ${r.padananSiap ? "✓" : "—"} · Ayat: ${r.lengkapSiap ? "✓" : "—"} · Cabaran: ${cab} · Kad: ${kadDiteroka}/12</span>
        </div>`;
      }).join("")
    : '<p class="kosong-negeri">Belum ada murid log masuk pada peranti ini.<br>Minta murid log masuk melalui halaman utama untuk mula merakam pencapaian.</p>';

  $("#dashPautan").innerHTML = `
    <li><a href="${INFO.urlProduk}" target="_blank" rel="noopener">URL Produk (GitHub Pages)</a><span class="pautan-label">${INFO.urlProduk}</span></li>
    <li><a href="${INFO.urlInstrumen}" target="_blank" rel="noopener">URL Instrumen Penilaian (Google Forms)</a><span class="pautan-label">${INFO.urlInstrumen}</span></li>
    <li><span class="pautan-label">Kata laluan demo guru: <code>guru123</code> — kongsikan hanya kepada guru yang berkenaan.</span></li>`;
}

function profilAvatar(nama) {
  let av = 0;
  try {
    av = Number(JSON.parse(localStorage.getItem("ksb-profil-" + nama) || "{}").avatar);
    if (!Number.isFinite(av)) av = 0;
  } catch { /* abaikan */ }
  return avatarHTML("murid", av, nama);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* =========================================================
   MODEL ASSURE (kad interaktif)
   ========================================================= */
const ASSURE = [
  { fasa: "A — Analyse Learners", tajuk: "Analisis Pelajar", detail: "Sasaran: murid Tahun 3 SK bercampur kebolehan termasuk murid disleksia dan masalah penglihatan. Analisis ini menentukan ciri aksesibiliti: fon mesra disleksia, narasi audio, mod kontras tinggi dan aras cabaran berbeza." },
  { fasa: "S — State Objectives", tajuk: "Nyatakan Objektif", detail: "4 objektif pembelajaran dirumus berdasarkan DSKP BM SK Tahun 3 (SK 5.1 & SP 5.1.3 — kata adjektif) dan dipaparkan di Laman Utama supaya murid dan guru jelas akan hasil pembelajaran yang diharapkan." },
  { fasa: "S — Select Methods & Media", tajuk: "Pilih Kaedah & Media", detail: "Kaedah: pembelajaran kendiri + permainan. Media dipilih: ilustrasi SVG asli bagi 12 kata adjektif, narasi audio (TTS), animasi, kuiz interaktif dan maklum balas serta-merta — semua menyokong pelbagai gaya belajar (visual, auditori, kinestetik)." },
  { fasa: "U — Utilize Media", tajuk: "Gunakan Media", detail: "Produk boleh diakses melalui pelayar web di komputer, tablet atau telefon. Guru memulakan sesi melalui Panduan Guru (set induksi → penerokaan → aktiviti → penutup)." },
  { fasa: "R — Require Participation", tajuk: "Libatkan Murid", detail: "4 aktiviti interaktif (Kuiz, Padanan, Lengkapkan Ayat, Cabaran Minda) memastikan setiap murid terlibat aktif dengan maklum balas serta-merta dan sistem bintang sebagai motivasi." },
  { fasa: "E — Evaluate & Revise", tajuk: "Nilai & Tambah Baik", detail: "Penilaian formatif berlaku dalam setiap permainan (skor automatik). Penilaian sumatif produk dilaksanakan melalui instrumen soal selidik kepada 15+ rakan pembelajaran, dan dapatan digunakan untuk penambahbaikan." }
];

function renderAssure() {
  $("#gridAssure").innerHTML = ASSURE.map((a, i) => `
    <article class="assure-kad" tabindex="0" role="button" aria-label="${a.fasa}. ${a.tajuk}. Klik untuk keterangan.">
      <span class="fasa">${a.fasa}</span>
      <h3>${a.tajuk}</h3>
      <p class="assure-detail" hidden>${a.detail}</p>
    </article>`).join("");
  $$(".assure-kad").forEach(kad => {
    const buka = () => {
      const d = $(".assure-detail", kad);
      d.hidden = !d.hidden;
      if (!d.hidden) sebut($("h3", kad).textContent + ". " + d.textContent);
    };
    kad.addEventListener("click", buka);
    kad.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); buka(); } });
  });
}

/* =========================================================
   ZON 3D & AR (A-Frame + AR.js — muat enjin secara malas)
   ========================================================= */
let enjin3dMuat = false;

function muatEnjin3D() {
  if (enjin3dMuat) return;
  enjin3dMuat = true;
  const skrip = (src) => new Promise((ok, gagal) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = ok;
    s.onerror = gagal;
    document.head.appendChild(s);
  });
  // A-Frame dahulu (termasuk THREE), kemudian pemalam AR.js (UMD: baca A.AFRAME)
  skrip("https://cdn.jsdelivr.net/npm/aframe@1.5.0/dist/aframe-master.min.js")
    .then(() => skrip("https://cdn.jsdelivr.net/npm/@ar-js-org/ar.js@3.4.4/aframe/build/aframe-ar.js"))
    .then(() => {
      binaScene3D();
      sebut("Selamat datang ke Zon 3D. Seret untuk memutar pandangan dan klik kad perkataan.");
      // Pemantau: jika pelayar tidak menyokong WebGL2, papar pesanan mesra
      setTimeout(() => {
        if (!$("#bekas3d canvas")) {
          $("#bekas3d").innerHTML = '<p class="kosong-negeri">Pelayar ini tidak menyokong paparan 3D (WebGL2 diperlukan). Sila guna versi terkini Chrome, Edge atau Safari.</p>';
        }
      }, 6000);
    })
    .catch(() => {
      $("#bekas3d").innerHTML = '<p class="kosong-negeri">Enjin 3D gagal dimuat — semak sambungan internet dan cuba lagi.</p>';
    });
}

function binaScene3D() {
  const bekas = $("#bekas3d");
  if (!bekas || !bekas.querySelector(".kosong-negeri")) return;
  const telefon = window.matchMedia("(max-width: 768px)").matches || ("ontouchstart" in window);
  const renderOpts = telefon
    ? "antialias: false; maxDevicePixelRatio: 1.2"
    : "antialias: true; maxDevicePixelRatio: 1.8";
  const warna = { jarak: "#7cb8ff", perasaan: "#ff8aa1", pancaindera: "#a3f7bf" };
  const arasY = { jarak: 1.7, perasaan: 0, pancaindera: -1.7 };
  const offsetSudut = { jarak: 0, perasaan: Math.PI / 4, pancaindera: Math.PI / 2 };
  let gelang = "";
  SIMPULAN.forEach((item, i) => {
    const r = 3.6;
    const sudut = (i % 4) * (Math.PI / 2) + offsetSudut[item.kategori];
    const x = (r * Math.cos(sudut)).toFixed(2);
    const z = (r * Math.sin(sudut)).toFixed(2);
    // Animasi terapung hanya pada peranti berkuasa (telefon = statik, lebih lancar)
    const anim = telefon ? "" : `animation="property: position; dir: alternate; dur: 2600; loop: true; to: ${x} ${arasY[item.kategori] + 0.25} ${z}"`;
    gelang += `
      <a-entity class="kata3d" data-idx="${i}" position="${x} ${arasY[item.kategori]} ${z}"
        geometry="primitive: plane; width: 1.7; height: 0.75"
        material="color: #1B2A4A; opacity: 0.94"
        text="value: ${item.sb.toUpperCase()}; color: ${warna[item.kategori]}; align: center; width: 3.2"
        ${anim}>
      </a-entity>`;
  });
  const jumBintang = telefon ? 12 : 40;
  let bintang = "";
  for (let i = 0; i < jumBintang; i++) {
    const bx = ((Math.random() * 2 - 1) * 9).toFixed(1);
    const by = (Math.random() * 5 + 1).toFixed(1);
    const bz = ((Math.random() * 2 - 1) * 9).toFixed(1);
    bintang += `<a-sphere position="${bx} ${by} ${bz}" radius="0.03" color="#8fa3c8"></a-sphere>`;
  }
  bekas.innerHTML = `
    <a-scene embedded vr-mode-ui="enabled: true" renderer="${renderOpts}">
      <a-sky color="#0e1630"></a-sky>
      <a-entity light="type: ambient; intensity: 0.75"></a-entity>
      <a-entity light="type: directional; intensity: 1.1; position: 2 4 3"></a-entity>
      <a-icosahedron position="0 0 -1" radius="0.85" color="#0071e3" metalness="0.4" roughness="0.35"
        animation="property: rotation; to: 0 360 0; loop: true; dur: 16000; easing: linear"></a-icosahedron>
      ${gelang}
      ${bintang}
      <a-entity camera position="0 0.8 6.2" look-controls="pointerLockEnabled: false" wasd-controls="acceleration: 30">
        <a-cursor fuse="false" color="#ffffff"></a-cursor>
      </a-entity>
    </a-scene>`;
  $$("#bekas3d .kata3d").forEach(k => k.addEventListener("click", () => {
    const item = SIMPULAN[Number(k.dataset.idx)];
    sebut(item.sb + ". " + "Kata adjektif " + KATEGORI[item.kategori].nama + ". " + item.makna);
  }));
}

function binaSceneAR() {
  const bekas = $("#bekasAr");
  const statusEl = $("#arStatus");
  // Pra-semak kebenaran kamera supaya pengguna faham apa yang berlaku
  const mulaAR = () => {
    bekas.innerHTML = `
      <a-scene embedded arjs="sourceType: webcam; detectionMode: mono_and_matrix; matrixCodeType: 3x3; debugUIEnabled: false;" vr-mode-ui="enabled: false">
        <a-marker preset="hiro">
          <a-torus-knot position="0 0.55 0" radius="0.3" radius-tubular="0.09" color="#FF6B9D" p="2" q="3"
            animation="property: rotation; to: 0 360 0; loop: true; dur: 9000; easing: linear"></a-torus-knot>
          <a-box position="0 0 0" depth="0.25" height="0.12" width="0.55" color="#1B2A4A"></a-box>
          <a-text value="MANIS" position="0 0.98 0" align="center" color="#7cb8ff" width="3"></a-text>
        </a-marker>
        <a-entity camera></a-entity>
      </a-scene>`;
    if (statusEl) { statusEl.hidden = false; statusEl.textContent = "Kamera aktif — halakan telefon ke penanda Hiro yang dicetak."; }
    sebut("Halakan kamera ke penanda Hiro yang dicetak.");
  };
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      .then(aliran => { aliran.getTracks().forEach(t => t.stop()); mulaAR(); })
      .catch(() => {
        if (statusEl) { statusEl.hidden = false; statusEl.textContent = "Kamera tidak dapat diakses. Benarkan akses kamera dalam tetapan pelayar (ikon gembok), kemudian cuba lagi. Guna Chrome atau Safari terkini."; }
      });
  } else {
    if (statusEl) { statusEl.hidden = false; statusEl.textContent = "Pelayar ini tidak menyokong kamera. Guna Chrome atau Safari pada telefon."; }
  }
}

/* Tab 3D / AR */
$$("[data-tab3d]").forEach(b => b.addEventListener("click", () => {
  const mod = b.dataset.tab3d;
  $$("[data-tab3d]").forEach(x => {
    const on = x.dataset.tab3d === mod;
    x.classList.toggle("is-active", on);
    x.setAttribute("aria-selected", String(on));
  });
  $("#zon-d3").hidden = mod !== "d3";
  $("#zon-ar").hidden = mod !== "ar";
}));
$("#btnAktifAr").addEventListener("click", binaSceneAR);

/* =========================================================
   MULA
   ========================================================= */
renderAvatar();
renderAssure();
mulaPadanan();
mulaLengkap();
muatTema();
muatSesi();

if (sesi) {
  masukAplikasi();
} else {
  $("#layarMasuk").hidden = false;
}

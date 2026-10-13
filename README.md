# Kosply Admin - UI Slicing

Slicing UI dashboard admin "Kosply Marketplace" dari desain Figma, pakai
**React (Vite) + Tailwind CSS**.

## Halaman yang dibuat (7 halaman)
1. Dashboard - `src/pages/Dashboard.jsx`
2. AI Model - `src/pages/AiModel.jsx`
3. Fraud Reports - `src/pages/FraudReports.jsx`
4. User Verification - `src/pages/UserVerification.jsx`
5. Tools Benchmark - `src/pages/ToolsBenchmark.jsx`
6. Contact Support - `src/pages/ContactSupport.jsx`
7. Settings - `src/pages/Settings.jsx`

## Struktur folder
```
src/
├── main.jsx          # entry point, pasang BrowserRouter
├── App.jsx            # routing ke 7 halaman
├── index.css           # import Tailwind
├── data/dummyData.js   # data dummy (pengganti backend)
├── components/
│   ├── Sidebar.jsx     # navigasi kiri (dipakai semua halaman)
│   ├── TopBar.jsx       # search + notifikasi + profil
│   ├── Layout.jsx        # pembungkus Sidebar + TopBar + konten
│   ├── Card.jsx            # container putih rounded
│   ├── StatCard.jsx         # kartu angka ringkasan
│   ├── StatusBadge.jsx       # badge "Active"
│   ├── ActionButton.jsx       # ikon aksi berwarna di tabel
│   ├── Table.jsx                # wrapper tabel generik
│   ├── Pagination.jsx            # navigasi "Page 1/4"
│   └── ProgressBar.jsx            # bar AI Tool Usage Frequency
└── pages/              # 7 halaman di atas
```

## Cara menjalankan
```bash
npm install
npm run dev
```
Buka link yang muncul di terminal (biasanya `http://localhost:5173`).

## Catatan
- Semua data (angka statistik, daftar model, laporan fraud, dll) adalah
  **data dummy statis** di `src/data/dummyData.js` - belum terhubung ke
  backend/API asli.
- Warna diambil dari estimasi screenshot desain (ungu sidebar, badge hijau
  untuk status aktif, dll) - kalau ada kode warna HEX exact dari Figma,
  tinggal disesuaikan di `tailwind.config.js`.

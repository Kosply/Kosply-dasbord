# Kosply Admin — Dashboard Ops (Next.js App Router)

Slicing UI dashboard admin **Kosply Marketplace** (desain UI/UX Figma) yang sekarang
sudah terhubung ke REST API **Express** (`Kosply-backend`).

## Stack

| Bagian | Teknologi |
| --- | --- |
| Framework | **Next.js 16 (App Router, React Server Components)** |
| Data fetching | `fetch` server-to-server di `lib/` + **TanStack Query** untuk bagian interaktif |
| Styling | Tailwind CSS + CSS variables (`app/globals.css`) |
| Font | `next/font` (Inter) |
| Ikon | `lucide-react` |
| Backend | Express + MariaDB/MySQL (`../Kosply-backend`) |

## Menjalankan dari nol

### 1. Backend (Express + MariaDB via Docker)

Ikuti walkthrough lengkap di README repo backend
(`../Kosply-backend/README.md` → **Getting started**): prerequisite Docker
Desktop, clone, `.env`, `docker compose up -d mariadb`, `./scripts/dev.sh
setup && ./scripts/dev.sh start`, lalu **`./seed.sh`** supaya data dashboard
tidak kosong.

Ringkas, kalau Docker + dependensi sudah siap dan `.env` sudah diisi:

```bash
cd ../Kosply-backend
docker compose up -d mariadb
./scripts/dev.sh setup && ./scripts/dev.sh start   # server di :3000
./seed.sh                                          # data dashboard
```

> Catatan: `npm run dev` frontend memakai port **:3000**, jadi di satu mesin
> jalankan backend di port lain — mis. `PORT=3500 ./scripts/dev.sh start` —
> lalu samakan `API_URL` di `.env.local`.

### 2. Frontend (repo ini)

```bash
npm install
cp .env.example .env.local   # sesuaikan API_URL dengan port backend
npm run dev                  # http://localhost:3000
```

`.env.local`:

```env
API_URL=http://localhost:3500   # base URL Express (server-to-server)
AUTH_ENABLED=false              # flag gerbang login (lihat bagian Login)
```

### 3. Build produksi

```bash
npm run build   # screenshot hasil build dilampirkan untuk UTS
npm start
```

## Struktur folder

```
styles/
└── globals.css                # Tailwind + CSS variables + @layer components
app/
├── layout.jsx                 # shell dokumen + font + QueryProvider
├── error.jsx / not-found.jsx  # error boundary & 404 global
├── (pages)/                   # route group — semua halaman (URL tidak berubah)
│   ├── page.jsx               # / (Dashboard Overview)
│   ├── loading.jsx            # loading boundary untuk /
│   ├── ai-model/              # daftar model + live search (React Query)
│   ├── fraud-reports/         # antrian moderasi fraud
│   ├── user-verification/     # antrian verifikasi KTM
│   ├── tools-benchmark/
│   ├── contact-support/
│   │   ├── page.jsx           # daftar tiket
│   │   └── [id]/page.jsx      # dynamic route detail tiket (notFound())
│   ├── settings/
│   └── login/                 # gerbang login admin (AUTH_ENABLED)
├── _actions/                  # Server Actions ("use server") per resource
│   ├── auth.js / models.js / reports.js / verifications.js / support.js
└── api/models/route.js        # BFF proxy untuk pencarian model (React Query)
components/
├── layout/                    # Layout, Sidebar, TopBar
├── ui/                        # Card, StatCard, Table, ActionButton, …
├── states/                    # EmptyState, ErrorState, LoadingState, StateContainer
├── providers/QueryProvider.jsx
├── models/ModelsTable.jsx     # island React Query (search + mutate)
├── support/ReplyForm.jsx      # useActionState + useFormStatus
├── auth/LoginForm.jsx
└── verification/RejectButton.jsx
lib/                           # pemanggil API Express (server-only)
├── routes.js                  # registry route tunggal (path, label, title, icon)
├── api/client.js              # ApiError + fetch wrapper (cek res.ok)
├── api/config.js              # API_URL + AUTH_ENABLED
├── auth/session.js            # cookie session (httpOnly)
├── auth/admins.js             # login + manajemen admin
├── resources/                 # models, reports, verifications, support, overview
└── utils/format.js            # format tanggal/harga/label
types/index.js                 # typedefs JSDoc (model data)
proxy.js                       # gerbang auth (pengganti middleware)
```

## Alur data (ringkasan)

```
Server Component (app/*/page.jsx)
  → lib/<resource>.js            (server-only, baca cookie session)
  → fetch ke Express API         (Authorization: Bearer <jwt>)
  → render HTML di server

Mutasi:
  Form/tombol (Client Component)
  → Server Action (app/_actions/)
  → Express API → revalidatePath() → Server Component render ulang

Bagian interaktif (React Query):
  Client Component → /api/models (route handler Next.js, BFF)
  → Express API → useQuery / useMutation → invalidateQueries
```

## Endpoint Express yang dipakai

| Halaman | Endpoint |
| --- | --- |
| Dashboard | `GET /api/reports?status=PENDING`, `/api/verifications`, `/api/support/tickets`, `/api/models` |
| AI Model | `GET /api/models`, `PATCH /api/models/:id` |
| Fraud Reports | `GET /api/reports`, `POST /api/reports/:id/review` |
| User Verification | `GET /api/verifications`, `POST /api/verifications/:id/review` |
| Contact Support | `GET /api/support/tickets`, `GET /api/support/tickets/:id`, `POST /api/support/tickets/:id/messages`, `POST /api/support/tickets/:id/close` |
| Tools Benchmark | `GET /api/tools/stats` |
| Settings | `PATCH /api/admin/users/me` (siap dipakai), cookie session |
| Login | `POST /api/admin/login` |

## Strategi render per halaman

| Halaman | Strategi | Alasan |
| --- | --- | --- |
| `/` Dashboard | **SSR** (`dynamic = 'force-dynamic'`) | KPI & antrian harus real-time dan membaca cookie session |
| `/ai-model` | **SSR** | Registry berubah lewat aksi admin; pencarian live di client (React Query) |
| `/fraud-reports` | **SSR** | Keputusan moderasi tidak boleh tampil basi dari cache |
| `/user-verification` | **SSR** | Urutan antrian ikut `updatedAt` (resubmit naik ke atas) |
| `/tools-benchmark` | **SSR** | Counter mengikuti aktivitas moderasi terkini |
| `/contact-support` | **SSR** | Status tiket berubah selama panel dibuka |
| `/contact-support/[id]` | **SSR** | Detail per sesi; `generateMetadata` + `notFound()` |
| `/settings` | **SSR** | Kartu profil terikat cookie session |
| `/login` | **SSR** | Membaca cookie untuk redirect bila sudah masuk |

## Login (flag `AUTH_ENABLED`)

Login dashboard sudah terhubung ke `POST /api/admin/login` (menerima baris tabel
`admins` maupun user dengan role `ADMIN`/`SUPER_ADMIN`). Karena alur login masih
dalam pengerjaan, gerbangnya bisa dinyalakan/dimatikan lewat `.env.local`:

- `AUTH_ENABLED=false` (default) — semua halaman dashboard terbuka. Halaman yang
  butuh endpoint admin akan menampilkan **ErrorState** 401 bila belum ada sesi.
  `/login` tetap bisa dibuka untuk membuat sesi manual.
- `AUTH_ENABLED=true` — `proxy.js` mengalihkan semua halaman dashboard ke
  `/login` bila belum ada cookie sesi, dan `/login` otomatis redirect jika sudah
  masuk.

Sesi disimpan sebagai cookie **httpOnly** (`kosply_token`, `kosply_admin`) di
dalam Server Action — JWT tidak pernah menyentuh JavaScript browser.

> Akun admin untuk development di-seed langsung ke database dev dan
> **kredensialnya tidak disimpan di repo** (repo akan dipublikasikan untuk UTS).
> Buat ulang kapan saja lewat skrip seed admin yang dijalankan dari mesin
> developer.

## Kondisi loading / kosong / error

- **Loading** — `app/**/loading.jsx` per halaman (dengan chrome sidebar tetap tampil).
- **Error** — `ErrorState` inline di tiap halaman untuk kegagalan API (401/503/dll.),
  plus `app/error.jsx` sebagai error boundary untuk error tak terduga.
- **Kosong** — `EmptyState` dipakai di semua tabel/antrian — termasuk Tools
  Benchmark saat window 30 hari belum berisi invocations — bukan angka dummy.
- `StateContainer` menyatukan ketiganya untuk permukaan data React Query.

## Yang belum (tahap UI berikutnya)

- Penyempurnaan pixel/ responsif penuh (360px / 768px / 1280px) & perbandingan screenshot Figma.
- Form tambah/edit model & form tambah admin (aksi server-nya sudah siap di `app/_actions/`).
- Wiring tombol filter/pill (High Priority, Sort, dll.) dan pagination.
- Tombol "Edit model" masih visual; "Nonaktifkan model" sudah berfungsi (React Query).

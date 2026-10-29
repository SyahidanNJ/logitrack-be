# logitrack-be

Backend **LogiTrack** (Warehouse Management System): REST API untuk barang masuk
dan keluar per batch, stok per bin, dokumen transaksi, dan master data gudang.
Express + Sequelize + MySQL, dengan dua koneksi database: data gudang dan data
karyawan (HR).

Antarmuka penggunanya ada di repo terpisah:
**[logitrack-fe](https://github.com/SyahidanNJ/logitrack-fe)**.

## Yang ditangani

- Autentikasi JWT lewat cookie httpOnly. NIK dan kata sandi dicek ke database
  karyawan, perannya diambil dari tabel pengguna LogiTrack.
- Master data: gudang, zona, bin location, produk, departemen, dan pengguna.
- Check-in: pencatatan per batch dengan supplier, nomor dokumen, dan lampiran
  berkas; stok bertambah di bin tujuan.
- Check-out: strategi FIFO/FEFO, memotong stok per batch, dan menolak transaksi
  yang melebihi stok tersedia.
- Riwayat pergerakan stok (IN/OUT) dan ringkasan dashboard: jumlah gudang, zona,
  produk, total stok, transaksi terakhir, dan stok terendah.
- Dokumen check-in/check-out: penerbitan, status, dan data untuk cetak.
- Validasi request dengan Joi, unggah berkas dengan multer, CORS berbasis daftar
  origin yang diizinkan.

## Jalan lokal (Windows)

1. Siapkan MySQL 8 (lokal atau `docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql:8.0`).
   Database `db_logitrack` dan `db_employee` dibuat otomatis saat server pertama
   kali jalan.
2. `copy env/.env.render.example env/.env.dev` → isi `MYSQL_LOGITRACK_*`,
   `MYSQL_EMPLOYEE_*`, `JWT_SECRET`, dan `MYSQL_SSL=false` untuk MySQL lokal.
3. `npm install` → `npm run dev` (memakai `env/.env.dev`).
4. Cek `GET http://localhost:3003/api/health`.
5. Login seed otomatis saat database masih kosong: NIK `ADMIN-001`, kata sandi
   `password123`.

Tabel dibuat lewat `sequelize.sync({ alter: true })` di mode non-production.
Di production, schema dianggap stabil supaya kolom tidak berubah saat restart.

## Endpoint utama

| Grup | Contoh |
| --- | --- |
| `GET /api/health` | status service |
| `/api/auth/*` | login (NIK + kata sandi), SSO, logout |
| `/api/check-ins` | daftar, detail, tambah, ubah, hapus barang masuk |
| `/api/check-outs` | proses barang keluar (FIFO/FEFO) |
| `/api/stocks`, `/api/stock-movements` | stok per batch dan riwayat pergerakan |
| `/api/dashboard` | ringkasan KPI dan transaksi terakhir |
| `/api/warehouses`, `/api/zones`, `/api/bin-locations` | master gudang |
| `/api/products` | master produk |
| `/api/documents` | dokumen transaksi dan data cetak |
| `/api/users`, `/api/notifications` | pengguna dan notifikasi |

## Struktur

```
src/
  routes/        titik masuk per grup endpoint (tipis)
  controllers/   logika tiap grup (auth, check-in/out, stok, master, dokumen)
  services/      query dan aturan bisnis, termasuk FIFO/FEFO dan validasi stok
  models/        model Sequelize data gudang
  models_employee/ model karyawan (database HR)
  middlewares/   auth JWT, upload, validator
  validators/    skema Joi
  tools/         cache peran pengguna dan format response
```

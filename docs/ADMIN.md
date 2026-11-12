# Panel Admin (Decap CMS)

Panel di `/admin` mengedit file data dan konten di repo ini. Setiap simpan menjadi
commit ke `main`, lalu Vercel membangun ulang situs. Tidak ada database atau server
tambahan.

## Yang bisa diedit

| Menu | File | Isi |
| --- | --- | --- |
| Donatur & Total Dana → Daftar Donatur | `src/data/donors.json` | tambah/ubah/hapus donatur dan nominal |
| Donatur & Total Dana → Angka Dana | `src/data/settings.json` | RAB, modal awal, pemasukan belum dirinci, tanggal update |
| Berita Pembangunan | `src/content/berita/*.md` | berita dan foto progres |
| Artikel Sedekah & Wakaf | `src/content/artikel/*.md` | artikel |

Total, persen, gauge, progress bar, sticky bar, dan meta description dihitung otomatis
dari data di atas. Tidak ada angka yang perlu disunting manual.

Tanpa panel, cara yang sama: sunting JSON/Markdown di atas, `npm run build`, commit, push.

## Setup login (sekali, oleh pemilik repo)

Login memakai GitHub, jadi perlu OAuth App. Saya sengaja tidak mengisi kredensial apa pun.

1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App.
   - Homepage URL: domain produksi situs.
   - Callback URL: `https://<domain>/api/callback`.
2. Simpan Client ID dan Client Secret **hanya** sebagai Environment Variables di Vercel
   (`OAUTH_GITHUB_CLIENT_ID`, `OAUTH_GITHUB_CLIENT_SECRET`). Jangan commit.
3. Tambahkan endpoint OAuth `api/auth` dan `api/callback` (Vercel Functions) yang menukar
   code GitHub dengan token untuk Decap. Setelah itu sesuaikan `base_url` di
   `public/admin/config.yml` dengan domain produksi.
4. Hanya akun GitHub yang punya akses tulis ke repo yang bisa menyimpan perubahan.

Sebelum langkah 3 selesai, `/admin` tampil tetapi belum bisa login.

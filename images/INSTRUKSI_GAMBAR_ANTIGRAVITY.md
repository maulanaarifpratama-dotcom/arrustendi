# INSTRUKSI FEED GAMBAR KE INDEX.HTML
# Untuk Antigravity — Masjid Ar-Rustendi

---

## LANGKAH 1: Copy folder gambar ke lokasi yang sama dengan index.html

Buat folder `images/` di dalam `C:\Users\maula\Desktop\masjid-arrustendi\`
Sehingga strukturnya jadi:
```
masjid-arrustendi/
├── index.html
└── images/
    ├── render-tampak-depan-malam.jpg     ← 3D render tampak depan (malam, 1076x717)
    ├── render-perspektif-malam.jpg       ← 3D render perspektif kiri (malam, 1076x717)
    ├── render-tampak-depan-2.jpg         ← 3D render tampak depan v2 (malam, 1076x717)
    ├── render-samping.jpg                ← 3D render tampak samping (malam, 744x495)
    ├── progress-pengukuran.jpg           ← Foto dokumentasi: pengukuran kiblat
    ├── progress-material-besi.jpg        ← Foto dokumentasi: material besi & batu
    ├── progress-galian-pondasi.jpg       ← Foto dokumentasi: penggalian pondasi
    ├── progress-pengurukan.jpg           ← Foto dokumentasi: pengurukan batu (ada di proposal tapi mirip)
    └── progress-doa-bersama.jpg          ← Foto dokumentasi: doa bersama + render di belakang
```

---

## LANGKAH 2: Replace semua placeholder di index.html

Cari SEMUA div.img-placeholder atau elemen dengan teks placeholder dan ganti dengan `<img>` tag berikut.

### HERO SECTION — Kolom Kanan, Card Utama:
```html
<!-- SEBELUM (placeholder): -->
<div class="img-placeholder rounded-xl aspect-[4/3] mb-4">...</div>

<!-- SESUDAH: -->
<img 
  src="images/render-tampak-depan-malam.jpg" 
  alt="Render 3D Masjid Jami Ar-Rustendi tampak depan" 
  class="w-full rounded-xl object-cover aspect-[4/3] mb-4"
  loading="eager"
>
```

### HERO SECTION — Card Kedua (bawah):
```html
<img 
  src="images/render-perspektif-malam.jpg" 
  alt="Render 3D Masjid Ar-Rustendi tampak perspektif malam"
  class="w-full rounded-xl object-cover aspect-video"
  loading="eager"
>
```

### GALERI — Tab "Rancangan Desain 3D" — 4 gambar:
```html
<!-- Card 1: Rendering Tampak Depan -->
<img 
  src="images/render-tampak-depan-malam.jpg"
  alt="Rendering Tampak Depan — Minimalis, pilar vertikal megah"
  class="w-full rounded-xl object-cover aspect-[4/3]"
  loading="lazy"
>

<!-- Card 2: Visual Sudut Perspektif Malam -->
<img 
  src="images/render-perspektif-malam.jpg"
  alt="Visual Sudut Perspektif Malam — Pencahayaan temaram hangat dramatis"
  class="w-full rounded-xl object-cover aspect-[4/3]"
  loading="lazy"
>

<!-- Card 3: Detail Ornamen Gerbang Masuk -->
<img 
  src="images/render-tampak-depan-2.jpg"
  alt="Detail Ornamen Gerbang Masuk — Aksen ukiran arabesque emas islami"
  class="w-full rounded-xl object-cover aspect-[4/3]"
  loading="lazy"
>

<!-- Card 4: Tampak Samping & Menara -->
<img 
  src="images/render-samping.jpg"
  alt="Tampak Samping & Menara — Susunan simetris arsitektur minimalis"
  class="w-full rounded-xl object-cover aspect-[4/3]"
  loading="lazy"
>
```

### GALERI — Tab "Dokumentasi Progress Lapangan" — 4 gambar:
```html
<!-- Card 1: Pengukuran Arah Kiblat -->
<img 
  src="images/progress-pengukuran.jpg"
  alt="Pengukuran arah kiblat menggunakan kompas — tahap awal pembangunan"
  class="w-full rounded-xl object-cover aspect-[4/3]"
  loading="lazy"
>

<!-- Card 2: Pasang Besi Tulangan -->
<img 
  src="images/progress-material-besi.jpg"
  alt="Material besi tulangan dan batu pondasi siap dipasang"
  class="w-full rounded-xl object-cover aspect-[4/3]"
  loading="lazy"
>

<!-- Card 3: Penggalian Pondasi -->
<img 
  src="images/progress-galian-pondasi.jpg"
  alt="Proses penggalian pondasi oleh tim pekerja"
  class="w-full rounded-xl object-cover aspect-[4/3]"
  loading="lazy"
>

<!-- Card 4: Doa Bersama + Dokumentasi -->
<img 
  src="images/progress-doa-bersama.jpg"
  alt="Doa bersama warga dan panitia DKM sebelum pembangunan dimulai"
  class="w-full rounded-xl object-cover aspect-[4/3]"
  loading="lazy"
>
```

### SECTION LATAR BELAKANG — Grid dokumentasi (jika ada):
```html
<!-- Ganti 4 img-placeholder di section "Kebutuhan yang Sudah Mendesak" -->
<img src="images/progress-pengukuran.jpg" alt="Pengukuran lahan" class="w-full rounded-xl object-cover aspect-square" loading="lazy">
<img src="images/progress-material-besi.jpg" alt="Material besi tulangan" class="w-full rounded-xl object-cover aspect-square" loading="lazy">
<img src="images/progress-galian-pondasi.jpg" alt="Penggalian pondasi" class="w-full rounded-xl object-cover aspect-square" loading="lazy">
<img src="images/progress-doa-bersama.jpg" alt="Doa bersama sebelum groundbreaking" class="w-full rounded-xl object-cover aspect-square" loading="lazy">
```

---

## LANGKAH 3: Tambahkan CSS untuk gambar supaya konsisten

Di dalam `<style>`, tambahkan:
```css
/* Pastikan semua gambar tidak overflow container */
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Object-fit untuk gambar dalam card */
.img-card {
  overflow: hidden;
  border-radius: var(--radius, 12px);
}
.img-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16,1,0.3,1);
}
.img-card:hover img {
  transform: scale(1.04);
}
```

Lalu wrap semua `<img>` galeri dalam `<div class="img-card">`:
```html
<div class="img-card rounded-xl aspect-[4/3]">
  <img src="images/render-tampak-depan-malam.jpg" alt="..." loading="lazy">
</div>
```

---

## LANGKAH 4: Tambahkan HERO dengan background gambar

Untuk hero yang lebih cinematic, tambahkan render 3D sebagai subtle background overlay:

```css
/* Di <style>: */
.hero-bg-image {
  position: absolute;
  inset: 0;
  background-image: url('images/render-tampak-depan-malam.jpg');
  background-size: cover;
  background-position: center;
  opacity: 0.08;   /* sangat subtle — jangan lebih dari 0.1 */
  mix-blend-mode: luminosity;
}
```

```html
<!-- Di dalam section#hero, setelah opening tag section: -->
<div class="hero-bg-image" aria-hidden="true"></div>
```

---

## LANGKAH 5: Verifikasi via MCP Chrome

Setelah semua gambar dipasang:
1. Reload index.html di Chrome
2. Screenshot hero section — render 3D harus tampil
3. Screenshot galeri section — semua 4 gambar 3D dan 4 foto progress harus tampil
4. Cek Network tab: semua gambar status 200, tidak ada 404
5. Cek di mobile 390px: gambar tidak overflow, aspect ratio terjaga
6. Cek hover effect pada gambar galeri: scale 1.04 smooth

---

## CATATAN PENTING

- Semua gambar sudah dioptimasi: max 1400px wide, JPEG quality 82
- Total folder images: ~2MB — masih aman untuk web
- Untuk deploy ke arrustendi.org: upload folder `images/` bersama `index.html`
- Jika pakai GitHub Pages/Netlify: pastikan folder images ikut ter-push

---

*Generated by Claude — Maulana Arif Pratama · impactory.id*

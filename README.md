# Undangan Pernikahan - Nuxt Wedding Invitation

Aplikasi undangan pernikahan modern yang dibangun dengan Nuxt 4, Tailwind CSS, dan Vue 3.

## Fitur

- **Hero Section** - Halaman pembuka dengan button "Buka Undangan"
- **Countdown Timer** - Hitung mundur menuju hari bahagia
- **Couple Profile** - Profil kedua mempelai
- **Gallery** - Galeri foto dengan auto-scroll infinite loop
- **Event Details** - Detail waktu & tempat acara (Akad & Resepsi)
- **RSVP Form** - Form konfirmasi kehadiran dengan:
  - Input nama tamu
  - Pilihan hadir/tidak hadir
  - Jumlah tamu (1-4 orang)
  - Input nama tamu tambahan jika lebih dari 1
  - Popup konfirmasi saat klik "Tidak Hadir"
- **Guestbook** - Kartu ucapan dengan:
  - Auto-scroll infinite loop dari bawah ke atas
  - Modal preview saat klik kartu
  - Tinggi tetap dengan truncate text
- **FormatDate** - Komponen format tanggal Indonesia

## Teknologi

- **Framework**: Nuxt 4
- **UI**: Vue 3 + Tailwind CSS v4
- **Icons**: Lucide Vue Next
- **Animations**: AOS (Animate On Scroll)
- **Carousel**: Swiper
- **Fonts**: Playfair Display, Inter, Cormorant Garamond

## Warna (CSS Variables)

| Variabel                | Warna   | Usage                    |
| ----------------------- | ------- | ------------------------ |
| `--color-primary`       | #0284c7 | Primary button, headings |
| `--color-primary-light` | #0ea5e9 | Hover states             |
| `--color-primary-dark`  | #0369a1 | Active states            |
| `--color-secondary`     | #f59e0b | Gold accent              |
| `--color-accent`        | #075985 | Dark blue text           |
| `--color-muted`         | #0ea5e9 | Muted text               |
| `--color-surface`       | #ffffff | Card backgrounds         |
| `--color-background`    | #f0f9ff | Page background          |

## Penggunaan Class

```vue
<!-- Text -->
<span class="text-primary">Primary Text</span>
<span class="text-primary-light">Light Text</span>
<span class="text-secondary">Gold Text</span>
<span class="text-accent">Accent Text</span>
<span class="text-muted">Muted Text</span>

<!-- Background -->
<div class="bg-primary">Primary BG</div>
<div class="bg-surface">Surface BG</div>
<div class="bg-background">Background BG</div>

<!-- Border -->
<div class="border-primary">Primary Border</div>
```

## FormatDate Component

```vue
<!-- Default: 20 juli 2026 -->
<FormatDate date="2026-07-20" />

<!-- Dengan hari: Minggu, 20 juli 2026 -->
<FormatDate date="2026-07-20" withDay />

<!-- Dengan waktu: 20 juli 2026 Jam 10:00 -->
<FormatDate date="2026-07-20T10:00:00" withTime />

<!-- Lengkap: Minggu, 20 juli 2026 Jam 10:00 -->
<FormatDate date="2026-07-20T10:00:00" withDay withTime />
```

## Setup

Install dependencies:

```bash
bun install
```

## Development

Start development server:

```bash
bun run dev
```

## Build

Build untuk production:

```bash
bun run build
```

## Deployment

Aplikasi siap deploy ke Vercel. Build output ada di `.vercel/output`.

```bash
npx vercel deploy --prebuilt
```

## Struktur File

```
app/
├── assets/css/
│   └── main.css          # Global styles & CSS variables
├── components/
│   ├── HeroSection.vue  # Halaman pembuka
│   ├── CountdownTimer.vue # Hitung mundur
│   ├── CoupleProfile.vue # Profil mempelai
│   ├── Gallery.vue      # Galeri foto
│   ├── EventDetails.vue # Detail acara
│   ├── RSVPForm.vue     # Form konfirmasi
│   └── Guestbook.vue    # Buku tamu
├── utils/
│   ├── FormatDate.vue   # Format tanggal Indonesia
│   └── FormatNumber.vue # Format angka
└── app.vue              # Main app component
```

## Lisensi

Dibuat dengan cinta oleh [Syaifal Illahi](https://fal-portfolio.vercel.app/).

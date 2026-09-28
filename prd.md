# Product Requirements Document (PRD)
**Project Name:** Modern Core Banking Simulation Web App
**Target Environment:** Antigravity (AI Code Generation)

## 1. Ringkasan Proyek
Aplikasi web ini adalah simulasi sistem *core banking* yang mengambil inspirasi fungsional dari antarmuka CLI/Terminal (seperti login, check balance, transfer) dan mengubahnya menjadi aplikasi berbasis web dengan antarmuka yang modern, elegan, dan responsif. Aplikasi ini juga akan menyediakan portal/direktori untuk mengakses berbagai layanan bank besar di Indonesia.

## 2. Tech Stack
*   **Frontend:** Next.js (App Router), React.js.
*   **Styling:** Tailwind CSS (Desain modern, elegan, menggunakan pendekatan *glassmorphism* atau *sleek dark/light mode*).
*   **Database & State:** Next.js Route Handlers (API Routes) dikombinasikan dengan file JSON lokal (misal: `data/db.json`) atau *state* statis/in-memory. Ini memenuhi syarat "database bawaan" tanpa perlu *setup database* eksternal.
*   **Ikon:** Lucide React atau Heroicons.

## 3. Fitur Utama & Alur Pengguna (User Flow)

**A. Halaman Otentikasi (Login Screen)**
*   Desain *card login* yang terpusat dan elegan.
*   Input *field* untuk **Account Number** dan **Password**.
*   Validasi otentikasi sederhana (mencocokkan dengan data statis).

**B. Notifikasi Sukses & Direktori Bank Indonesia**
*   Setelah login, tampilkan status koneksi berhasil (misal: "Login corebanking successful!").
*   Tampilkan *grid layout* modern berisi daftar bank di Indonesia beserta *link* resmi (membuka di *tab* baru).

**C. Dashboard Utama (Menu Transaksi)**
Mengadaptasi menu dari sistem terminal referensi menjadi *dashboard* interaktif:
1.  **Check Balance:** Menampilkan nama *user* (misal: FAUZAN) dan saldo saat ini (misal: IDR 280,118,714) dalam bentuk *card metric* yang mencolok.
2.  **Transfer:** Formulir antarmuka untuk mengirim dana (rekening tujuan, nominal).
3.  **Remittance:** Formulir antarmuka untuk transfer lintas negara/valuta asing.
4.  **Exit (Logout):** Tombol aksi untuk menghapus sesi dan mengembalikan pengguna ke halaman login.

## 4. Referensi Data Bank (Indonesia)
Aplikasi harus menampilkan daftar bank berikut dalam bentuk *card* atau logo interaktif:
*   **BCA:** https://www.bca.co.id
*   **Bank Mandiri:** https://bankmandiri.co.id
*   **BRI:** https://bri.co.id
*   **BNI:** https://www.bni.co.id
*   **BSI (Bank Syariah Indonesia):** https://www.bankbsi.co.id
*   **CIMB Niaga:** https://www.cimbniaga.co.id
*   **Bank Permata:** https://www.permatabank.com
*   **Bank Danamon:** https://www.danamon.co.id

## 5. Struktur Database (Mock JSON/In-Memory)
Data statis yang digunakan untuk simulasi di *environment* Next.js:

```json
{
  "users": [
    {
      "account_number": "8333295073",
      "name": "FAUZAN",
      "password": "password123",
      "balance": 280118714
    }
  ],
  "banks": [
    { "id": "bca", "name": "BCA", "url": "https://www.bca.co.id" },
    { "id": "mandiri", "name": "Bank Mandiri", "url": "https://bankmandiri.co.id" },
    { "id": "bri", "name": "BRI", "url": "https://bri.co.id" },
    { "id": "bni", "name": "BNI", "url": "https://www.bni.co.id" },
    { "id": "bsi", "name": "BSI", "url": "https://www.bankbsi.co.id" },
    { "id": "cimb", "name": "CIMB Niaga", "url": "https://www.cimbniaga.co.id" },
    { "id": "permata", "name": "Bank Permata", "url": "https://www.permatabank.com" },
    { "id": "danamon", "name": "Bank Danamon", "url": "https://www.danamon.co.id" }
  ]
}
```

## 6. Panduan Desain (UI/UX)
*   **Tema:** Minimalis modern dengan perpaduan warna gelap yang profesional (misal: *slate* atau *zinc* gelap) dengan aksen warna cerah (seperti biru *corporate* atau hijau *emerald* untuk indikator sukses/saldo).
*   **Layout:** *Centered card* untuk login, dan *Sidebar + Main Content area* untuk *dashboard* setelah login.
*   **Animasi:** Gunakan transisi halus pada *hover* (daftar bank, menu) menggunakan utilitas Tailwind (contoh: `transition-all duration-300 hover:shadow-xl`).
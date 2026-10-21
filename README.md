# POB Donggi Matindok

Prototipe interaktif pencatatan personel, pemeriksaan kesehatan harian (DCU), dan tindak lanjut klinik untuk CPP Donggi serta CPP Matindok.

## Buka aplikasi

Tautan publik: https://harastay.github.io/POB/

Aplikasi mendukung HP, tablet, dan komputer. Di HP, buka **Menu** untuk berpindah halaman. Tabel tampil sebagai kartu berlabel agar seluruh kolom terbaca.

## Fitur

- Ringkasan dan daftar keberadaan per CPP serta area, dengan filter dan rincian personel.
- Pendaftaran personel dan tamu, kartu, barcode, masa berlaku, penggantian dan penonaktifan akses.
- Pencatatan masuk keluar dan penanda catatan yang perlu diverifikasi.
- Hasil pemeriksaan harian, alarm klinik, tindakan dan keputusan dokter.
- Riwayat per orang dan per hari, koreksi beralasan serta persetujuan perubahan medis oleh dokter.
- Ekspor CSV, cadangan dan pemulihan data.

Versi 1.5 menyediakan menu mobile, formulir dan tombol sentuh, serta kartu yang menampilkan seluruh data tanpa menggeser tabel ke samping.

## Menjalankan lokal

Pasang Node.js 20 atau lebih baru. Buka folder ini di VS Code, lalu jalankan:

```sh
npm start
```

Buka http://127.0.0.1:4173. Tidak perlu npm install. Hentikan dengan Ctrl+C.

Pengujian logika:

```sh
npm test
```

## Status prototipe

Seluruh data awal merupakan data ilustratif. Data perubahan tersimpan di browser masing-masing dan tidak tersinkron antarperangkat. Pilihan akun memperagakan hak akses, belum merupakan login produksi. Pembaca kartu, pintu dan alat DCU belum terhubung secara fisik. Tombol pengujian ditandai SIMULASI. Jangan memasukkan data kesehatan atau identitas nyata ke prototipe publik ini.

## GitHub Pages

Sumber publikasi: branch `main`, folder `/ (root)`. Aset memakai alamat relatif agar bekerja pada jalur `/POB/`.

## Pustaka

Barcode menggunakan JsBarcode CODE128 dengan lisensi MIT. Pustaka dan lisensi disertakan di repositori tanpa ketergantungan CDN.

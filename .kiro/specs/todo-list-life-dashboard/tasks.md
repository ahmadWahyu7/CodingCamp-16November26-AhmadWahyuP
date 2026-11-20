# Implementation Plan: To-Do List Life Dashboard

## Overview

Implementasi dilakukan secara bertahap dari setup project hingga deployment. Setiap grup task berkaitan dengan satu fitur atau aspek teknis yang dapat diverifikasi secara mandiri. Stack: HTML + Tailwind CSS (CDN) + Vanilla JavaScript (satu file `app.js`), di-deploy melalui GitHub Pages.

## Tasks

- [x] 1. Setup Project & Struktur Folder
  - [x] 1.1 Buat struktur folder project
    - Buat folder `css/` dan `js/` di root project
    - Buat file `index.html`, `css/style.css`, dan `js/app.js` (masing-masing kosong)
    - Buat file `README.md` di root
    - Verifikasi: struktur folder sesuai dengan yang didefinisikan di design — tepat satu file di `css/` dan tepat satu file di `js/`
    - _Requirements: 10.4_

  - [x] 1.2 Siapkan boilerplate `index.html`
    - Tambahkan doctype HTML5, tag `<html lang="id">`, `<head>`, dan `<body>`
    - Tambahkan `<meta charset="UTF-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1.0">`, dan `<title>`
    - Tambahkan link ke Tailwind CSS Play CDN (`https://cdn.tailwindcss.com`)
    - Tambahkan link ke Google Fonts: Lato (weight 400 & 700) dan Luckiest Guy
    - Tambahkan `<link>` ke `css/style.css` dan `<script defer>` ke `js/app.js`
    - Verifikasi: buka file di browser — tidak ada error konsol, font Lato diterapkan
    - _Requirements: 10.2, 10.3, 11.1, 11.2_

- [x] 2. HTML Foundation
  - [ ] 2.1 Buat struktur markup header / navbar
    - Tambahkan elemen `<header>` dengan tombol `#theme-toggle-btn` (min 44×44px via class Tailwind)
    - Tombol berisi label teks atau ikon untuk membedakan state Light/Dark
    - _Requirements: 8.1_

  - [ ] 2.2 Buat markup Greeting Section
    - Tambahkan section dengan elemen: `#greeting-text`, `#clock-display`, `#date-display`
    - Tambahkan `<input id="name-input" maxlength="50">` dan `<button id="name-save-btn">`
    - Tambahkan `<span id="clock-error">` dengan `class="hidden"` sebagai default
    - _Requirements: 1.1, 1.2, 1.5, 3.1_

  - [ ] 2.3 Buat markup Focus Timer
    - Tambahkan section dengan `#timer-display` (akan menggunakan font Luckiest Guy)
    - Tambahkan tombol `#timer-start-btn`, `#timer-stop-btn`, `#timer-reset-btn`
    - Tambahkan `<input id="timer-duration-input" type="number" min="1" max="120">` dan `<button id="timer-save-duration-btn">`
    - Tambahkan `<span id="timer-duration-error" class="hidden">` dan `<div id="timer-complete-notification" class="hidden">`
    - _Requirements: 4.1, 4.6, 5.1_

  - [ ] 2.4 Buat markup To-Do List
    - Tambahkan section dengan `<input id="todo-input" maxlength="200">` dan `<button id="todo-add-btn">`
    - Tambahkan `<span id="todo-empty-warning" class="hidden">`
    - Tambahkan `<ul id="todo-list">` sebagai container daftar task
    - _Requirements: 6.1, 6.3_

  - [ ] 2.5 Buat markup Quick Links
    - Tambahkan section dengan `<input id="link-name-input" maxlength="50">`, `<input id="link-url-input" maxlength="2000">`, dan `<button id="link-add-btn">`
    - Tambahkan `<span id="link-warning" class="hidden">`
    - Tambahkan `<div id="link-list">` sebagai container kartu pintasan
    - _Requirements: 7.1, 7.3_

- [x] 3. CSS Foundation
  - [ ] 3.1 Definisikan CSS custom properties dan konfigurasi Tailwind
    - Di `css/style.css`, definisikan CSS variables untuk warna: `--color-bg-light: #F7E5C1`, `--color-text-light: #1C393F`, `--color-bg-dark: #1C393F`, `--color-text-dark: #F7E5C1`
    - Konfigurasikan Tailwind via inline `<script>` di `index.html` untuk menambahkan warna kustom tersebut ke theme
    - _Requirements: 8.3, 8.4_

  - [ ] 3.2 Tambahkan base styles dan utility CSS
    - Terapkan font Lato sebagai font default di `body` via `css/style.css`
    - Terapkan font Luckiest Guy pada `#timer-display` via CSS selector
    - Tambahkan class `.dark` pada elemen `<html>` sebagai target toggle tema
    - Definisikan transisi tema: `transition: background-color 150ms ease, color 150ms ease` agar pergantian tema mulus di bawah 300ms
    - Tambahkan style untuk `rounded corners` (border-radius min 8px) dan `box-shadow` pada class kartu komponen
    - _Requirements: 8.2, 11.1, 11.2, 11.3, 11.4_

  - [ ] 3.3 Tambahkan animasi dan override Tailwind
    - Tambahkan style animasi untuk notifikasi timer selesai (fade-in atau slide-in)
    - Pastikan padding minimum 16px dan margin antar komponen minimum 16px diterapkan via Tailwind class atau CSS
    - _Requirements: 11.5_

- [x] 4. Greeting Section
  - [x] 4.1 Implementasikan `GreetingModule` — clock dan tanggal
    - Di `js/app.js`, buat objek `GreetingModule` dengan method `init()`, `startClock()`, `updateDisplay(date)`, `formatTime(date)`, dan `formatDate(date)`
    - `startClock()` menjalankan `setInterval` setiap 1000ms yang memanggil `updateDisplay(new Date())`
    - `formatTime(date)` mengembalikan string `"HH:MM:SS"` dengan padding dua digit
    - `formatDate(date)` mengembalikan string Bahasa Indonesia, contoh: `"Senin, 20 November 2026"` menggunakan `Date.toLocaleDateString('id-ID', {...})`
    - Verifikasi: jam berdetak setiap detik, format dua digit, tanggal dalam Bahasa Indonesia
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 4.2 Implementasikan watchdog pembaruan waktu
    - Simpan `lastTickTime = Date.now()` setiap kali `updateDisplay()` dipanggil
    - Jalankan watchdog `setInterval` setiap 3000ms yang memeriksa apakah selisih `Date.now() - lastTickTime > 2000`
    - Jika kondisi terpenuhi, tampilkan `#clock-error` (hapus class `hidden`); sebaliknya pastikan tersembunyi
    - Verifikasi: elemen `#clock-error` tersembunyi saat jam berjalan normal
    - _Requirements: 1.5_

  - [x] 4.3 Implementasikan `getGreeting(hour)` dan `renderGreeting()`
    - `getGreeting(hour)` mengembalikan: `"Selamat Pagi"` (5–11), `"Selamat Siang"` (12–14), `"Selamat Sore"` (15–17), `"Selamat Malam"` (18–23 dan 0–4)
    - Jika `hour` tidak valid atau zona waktu tidak terdeteksi, kembalikan `"Selamat Datang"`
    - `renderGreeting()` menggabungkan hasil `getGreeting()` dengan nama yang tersimpan → update `#greeting-text`
    - Panggil `renderGreeting()` dari dalam `updateDisplay()` setiap tick
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [x] 4.4 Implementasikan `saveName()`, `loadName()`, dan handler input nama
    - `saveName(name)` menyimpan ke `localStorage` dengan key `tl_username` menggunakan `safeSet()`
    - `loadName()` membaca dari `localStorage` menggunakan `safeGet()` dengan fallback string kosong
    - Tambahkan event listener pada `#name-save-btn` (click) dan `#name-input` (keydown Enter)
    - Saat disimpan, panggil `saveName()` lalu `renderGreeting()`
    - Jika input melebihi 50 karakter, HTML `maxlength` mencegah input; tidak diperlukan validasi JS tambahan
    - Jika input kosong atau hanya spasi, simpan sebagai string kosong → salam tanpa nama
    - Verifikasi: nama tersimpan, muncul di salam, persist setelah reload
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [ ]* 4.5 Tulis property test untuk `getGreeting(hour)` — Property 1
    - **Property 1: Pemetaan salam berdasarkan jam**
    - Generate integer arbitrary 0–23; verifikasi output selalu salah satu dari empat string yang valid; verifikasi konsistensi (input sama → output sama)
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4**

  - [ ]* 4.6 Tulis property test untuk nama round-trip — Property 2
    - **Property 2: Nama pengguna disimpan dan dibaca kembali dengan benar (round-trip)**
    - Generate string panjang 1–50 (bukan hanya whitespace); verifikasi `loadName()` mengembalikan string identik setelah `saveName()`
    - **Validates: Requirements 3.3, 3.4**

- [x] 5. Focus Timer
  - [x] 5.1 Implementasikan `TimerModule` — state, `formatMMSS()`, dan `updateDisplay()`
    - Buat `TimerModule` dengan state: `intervalId`, `remainingSeconds`, `activeDurationMinutes`, `pendingDurationMinutes`
    - `formatMMSS(seconds)` mengembalikan string `"MM:SS"` dengan padding dua digit
    - `updateDisplay()` menulis hasil `formatMMSS(remainingSeconds)` ke `#timer-display`
    - `init()` memanggil `loadDuration()`, mengatur `remainingSeconds = activeDurationMinutes * 60`, lalu `updateDisplay()`
    - Verifikasi: timer menampilkan `"25:00"` saat halaman dimuat pertama kali
    - _Requirements: 4.1, 4.2_

  - [x] 5.2 Implementasikan `start()`, `stop()`, `reset()`, dan `tick()`
    - `start()`: jika tidak sedang berjalan, jalankan `setInterval(tick, 1000)`, panggil `setButtonState(true)`
    - `tick()`: kurangi `remainingSeconds` sebesar 1, panggil `updateDisplay()`; jika `remainingSeconds <= 0`, panggil `onComplete()`
    - `stop()`: `clearInterval(intervalId)`, panggil `setButtonState(false)` — `remainingSeconds` tidak direset
    - `reset()`: `clearInterval`, set `remainingSeconds = activeDurationMinutes * 60`, `updateDisplay()`, `setButtonState(false)`
    - `setButtonState(isRunning)`: disable/enable `#timer-start-btn`; saat berjalan, tombol Start di-disable
    - Verifikasi: Start → timer berjalan; Stop → timer berhenti, waktu tersisa; Reset → kembali ke durasi aktif
    - _Requirements: 4.3, 4.4, 4.5, 4.7, 4.8_

  - [x] 5.3 Implementasikan `onComplete()` dan notifikasi
    - Saat `remainingSeconds <= 0`, tampilkan `#timer-complete-notification` (hapus class `hidden`)
    - Tambahkan tombol atau mekanisme di dalam notifikasi untuk menutupnya (kembalikan class `hidden`)
    - Panggil `setButtonState(false)` setelah selesai
    - Verifikasi: notifikasi muncul saat timer mencapai 00:00 dan dapat ditutup
    - _Requirements: 4.6_

  - [x] 5.4 Implementasikan `saveDuration()`, `loadDuration()`, dan handler pengaturan durasi
    - `saveDuration(minutes)`: validasi `1 ≤ minutes ≤ 120`; jika valid, simpan ke `localStorage` key `tl_timer_duration` via `safeSet()`, update `activeDurationMinutes`; jika timer idle, langsung reset tampilan
    - `loadDuration()`: baca dari `localStorage` via `safeGet()`, parse ke integer, fallback ke `25` jika tidak valid
    - Handler pada `#timer-save-duration-btn` (click) dan `#timer-duration-input` (keydown Enter): baca nilai input → panggil `saveDuration()`
    - Jika nilai tidak valid, tampilkan `#timer-duration-error`; jika valid, sembunyikan error
    - Jika timer sedang berjalan saat durasi diubah, simpan ke `pendingDurationMinutes` dan terapkan setelah `reset()` atau `onComplete()`
    - Verifikasi: durasi 45 tersimpan → reload → timer menampilkan `45:00`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ]* 5.5 Tulis property test untuk validasi durasi timer — Property 8
    - **Property 8: Validasi durasi timer menerima nilai dalam rentang dan menolak di luar rentang**
    - Generate integer di dalam (1–120) dan di luar rentang; verifikasi fungsi validasi menerima/menolak sesuai kondisi
    - **Validates: Requirements 5.1, 5.4**

  - [ ]* 5.6 Tulis property test untuk durasi round-trip — Property 9
    - **Property 9: Durasi timer round-trip ke localStorage**
    - Generate integer 1–120; verifikasi `loadDuration()` mengembalikan nilai identik setelah `saveDuration()`
    - **Validates: Requirements 5.5, 5.6**

- [x] 6. To-Do List
  - [x] 6.1 Implementasikan `TodoModule` — model, `saveTasks()`, dan `loadTasks()`
    - Buat `TodoModule` dengan state `tasks` (array)
    - `saveTasks()`: `safeSet('tl_tasks', JSON.stringify(tasks))`
    - `loadTasks()`: baca dengan `safeGet('tl_tasks', '[]')`, parse dengan `JSON.parse` dalam `try/catch`; fallback ke `[]`
    - `init()`: set `tasks = loadTasks()`, panggil `renderAll()`
    - _Requirements: 6.11, 6.12_

  - [x] 6.2 Implementasikan `renderTask(task)` dan `renderAll()`
    - `renderTask(task)` membuat elemen `<li>` dengan: tombol centang `[data-action="toggle"][data-id]`, teks tugas (dengan class `line-through` jika `done === true`), tombol edit `[data-action="edit"][data-id]`, tombol hapus `[data-action="delete"][data-id]`
    - `renderAll()` mengosongkan `#todo-list` lalu menambahkan `renderTask()` untuk setiap task
    - Tambahkan event delegation pada `#todo-list` untuk menangani klik tombol berdasarkan `data-action`
    - Verifikasi: task yang ada di `localStorage` tampil saat halaman dimuat
    - _Requirements: 6.8, 6.9_

  - [x] 6.3 Implementasikan `addTask(text)` dan handler input
    - `addTask(text)`: validasi — trim text, jika kosong tampilkan `#todo-empty-warning` dan return; jika valid, buat objek Task baru `{id: Date.now().toString(), text, done: false, createdAt: Date.now()}`, push ke `tasks`, panggil `saveTasks()` lalu `renderAll()`
    - `maxlength="200"` pada HTML mencegah input lebih dari 200 karakter
    - Tambahkan event listener pada `#todo-add-btn` (click) dan `#todo-input` (keydown Enter)
    - Setelah berhasil menambahkan task, kosongkan input dan sembunyikan warning
    - Verifikasi: task muncul di daftar, input dibersihkan, warning muncul jika input kosong
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 6.4 Implementasikan `toggleTask(id)`, `editTask(id, newText)`, dan `deleteTask(id)`
    - `toggleTask(id)`: temukan task berdasarkan id, flip `done`, panggil `saveTasks()` lalu `renderAll()`
    - `deleteTask(id)`: filter task dari array, panggil `saveTasks()` lalu `renderAll()`
    - `editTask(id, newText)`: trim newText; jika kosong, tampilkan warning dan return; jika valid, update `text`, panggil `saveTasks()` lalu `renderAll()`
    - Mode edit: saat tombol edit diklik, ganti teks tugas dengan `<input>` yang berisi teks saat ini; saat dikonfirmasi (Enter atau tombol simpan), panggil `editTask()`
    - Verifikasi: centang task → teks dicoret; edit task → teks berubah; hapus task → task hilang dari daftar
    - _Requirements: 6.5, 6.6, 6.7, 6.8, 6.9, 6.10_

  - [ ]* 6.5 Tulis property test untuk Task list round-trip — Property 3
    - **Property 3: Task list round-trip ke localStorage**
    - Generate array objek Task valid; verifikasi `loadTasks()` mengembalikan array struktural identik setelah `saveTasks()`
    - **Validates: Requirements 6.11, 6.12**

  - [ ]* 6.6 Tulis property test untuk addTask menambah panjang daftar — Property 4
    - **Property 4: Menambah task selalu menambah panjang daftar**
    - Generate array Task + string non-kosong (panjang 1–200, bukan hanya whitespace); verifikasi panjang array bertambah tepat satu setelah `addTask()`
    - **Validates: Requirements 6.2**

  - [ ]* 6.7 Tulis property test untuk input tidak valid tidak mengubah daftar — Property 5
    - **Property 5: Input task tidak valid tidak mengubah daftar**
    - Generate string whitespace-only (spasi, tab, newline); verifikasi array Task tidak berubah setelah `addTask()`
    - **Validates: Requirements 6.3**

- [x] 7. Quick Links
  - [x] 7.1 Implementasikan `LinksModule` — model, `saveLinks()`, dan `loadLinks()`
    - Buat `LinksModule` dengan state `links` (array)
    - `saveLinks()`: `safeSet('tl_links', JSON.stringify(links))`
    - `loadLinks()`: baca dengan `safeGet`, parse dengan `JSON.parse` dalam `try/catch`; fallback ke `[]`
    - `init()`: set `links = loadLinks()`, panggil `renderAll()`
    - _Requirements: 7.7, 7.8_

  - [x] 7.2 Implementasikan `normalizeUrl(url)` dan `addLink(name, url)`
    - `normalizeUrl(url)`: jika url tidak diawali `"http://"` atau `"https://"`, tambahkan `"https://"` di depan; jika sudah ada prefix, kembalikan url tanpa modifikasi
    - `addLink(name, url)`: trim keduanya; jika salah satu kosong/hanya spasi, tampilkan `#link-warning` dan return; normalkan url, buat objek Link `{id: Date.now().toString(), name, url}`, push ke `links`, panggil `saveLinks()` lalu `renderAll()`
    - Tambahkan event listener pada `#link-add-btn` (click)
    - Setelah berhasil menambah link, kosongkan kedua input dan sembunyikan warning
    - Verifikasi: link muncul sebagai kartu; URL tanpa prefix menjadi `https://`; warning muncul jika input kosong
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 7.3 Implementasikan `renderLink(link)`, `renderAll()`, dan `deleteLink(id)`
    - `renderLink(link)` membuat kartu yang berisi anchor `<a href="{url}" target="_blank" rel="noopener noreferrer">{name}</a>` dan tombol hapus `[data-action="delete"][data-id]`
    - `renderAll()` mengosongkan `#link-list` lalu merender setiap link
    - Tambahkan event delegation pada `#link-list` untuk hapus; `deleteLink(id)` menghapus dari array, `saveLinks()`, `renderAll()`
    - Verifikasi: klik link → tab baru terbuka; klik hapus → kartu hilang
    - _Requirements: 7.5, 7.6, 7.7, 7.8_

  - [ ]* 7.4 Tulis property test untuk normalisasi URL — Property 6
    - **Property 6: Normalisasi URL menambahkan prefix jika diperlukan**
    - Generate string URL acak (dengan/tanpa prefix http/https); verifikasi output selalu diawali `"http://"` atau `"https://"`; jika input sudah memiliki prefix, output identik dengan input
    - **Validates: Requirements 7.4**

  - [ ]* 7.5 Tulis property test untuk Links round-trip — Property 7
    - **Property 7: Quick Links round-trip ke localStorage**
    - Generate array objek Link valid; verifikasi `loadLinks()` mengembalikan array struktural identik setelah `saveLinks()`
    - **Validates: Requirements 7.7, 7.8**

- [x] 8. Theme Manager
  - [x] 8.1 Implementasikan helper `safeGet()` dan `safeSet()`
    - Tambahkan fungsi `safeGet(key, fallback)` dan `safeSet(key, value)` di bagian paling atas `app.js`, sebelum semua module
    - Keduanya membungkus operasi `localStorage` dalam `try/catch`; `safeGet` mengembalikan `fallback` jika gagal atau nilai null; `safeSet` mencetak `console.warn` jika gagal
    - Verifikasi: semua module menggunakan helper ini untuk akses localStorage
    - _Requirements: 3.7, 5.6, 6.12, 7.8, 8.6, 8.7_

  - [x] 8.2 Implementasikan `ThemeModule`
    - Buat `ThemeModule` dengan method `init()`, `toggle()`, `apply(theme)`, `saveTheme(theme)`, `loadTheme()`
    - `apply(theme)`: jika `theme === "dark"`, tambahkan class `dark` pada `<html>`; jika `"light"`, hapus class `dark`; perbarui teks/ikon `#theme-toggle-btn` sesuai state
    - `loadTheme()`: baca dari `localStorage` key `tl_theme` via `safeGet()`; default `"light"` jika tidak ada
    - `saveTheme(theme)`: simpan ke `localStorage` via `safeSet()`
    - `toggle()`: flip antara `"light"` dan `"dark"`, panggil `saveTheme()` lalu `apply()`
    - `init()`: panggil `apply(loadTheme())` — ini harus dipanggil sebelum konten lain dirender agar tidak ada flash
    - Tambahkan event listener pada `#theme-toggle-btn`
    - Verifikasi: toggle mengubah tampilan seluruh dashboard; preferensi persist setelah reload; default Light Mode
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

  - [x] 8.3 Terapkan color scheme Tailwind untuk Light Mode dan Dark Mode
    - Di `index.html`, pastikan konfigurasi Tailwind (`tailwind.config`) mendefinisikan `darkMode: 'class'`
    - Terapkan Tailwind dark variant (`dark:bg-...`, `dark:text-...`) pada semua elemen kartu, header, section, tombol, dan input untuk warna yang sesuai dengan `#1C393F` (bg dark) dan `#F7E5C1` (text dark)
    - Terapkan warna light mode pada class default: latar `#F7E5C1`, teks `#1C393F`
    - Verifikasi: semua komponen berubah warna saat tema di-toggle, dalam waktu < 300ms
    - _Requirements: 8.2, 8.3, 8.4_

- [ ] 9. Checkpoint — Verifikasi Integrasi Fitur Utama
  - Pastikan semua module (`GreetingModule`, `TimerModule`, `TodoModule`, `LinksModule`, `ThemeModule`) terpanggil dari satu fungsi `init()` di bawah `DOMContentLoaded`
  - Pastikan tidak ada error JavaScript di konsol Chrome, Firefox, Edge
  - Pastikan data dari setiap fitur persist setelah hard-reload
  - Pastikan semua tests pass, tanyakan kepada user jika ada pertanyaan.

- [ ] 10. Responsive Design & Polish
  - [ ] 10.1 Implementasikan layout mobile-first (< 768px)
    - Pastikan semua komponen dalam satu kolom vertikal, tidak ada overflow horizontal
    - Gunakan Tailwind class `w-full`, `flex-col`, `overflow-x-hidden`
    - Periksa pada viewport 320px
    - _Requirements: 9.1, 9.2_

  - [ ] 10.2 Implementasikan layout tablet (768px–1023px)
    - Greeting penuh lebar; Timer dan Todo berdampingan menggunakan `md:grid-cols-2`; Links di bawah
    - _Requirements: 9.3_

  - [ ] 10.3 Implementasikan layout desktop (≥ 1024px)
    - Gunakan `lg:grid-cols-3` atau layout multi-kolom sesuai desain
    - Semua komponen memanfaatkan seluruh lebar area konten
    - _Requirements: 9.4_

  - [ ] 10.4 Verifikasi touch targets dan polish visual
    - Pastikan semua tombol interaktif memiliki area sentuh minimum 44×44px (gunakan `min-h-[44px] min-w-[44px]` atau `p-3`)
    - Pastikan padding minimum 16px pada semua kartu dan margin antar komponen minimum 16px
    - Verifikasi rounded corners (min `rounded-lg` = 8px) dan box-shadow pada semua kartu
    - _Requirements: 8.1, 9.5, 11.3, 11.4, 11.5_

- [ ] 11. Testing & Deployment
  - [ ] 11.1 Setup environment pengujian dengan fast-check
    - Buat file `js/app.test.js` atau folder `tests/` khusus pengujian
    - Install fast-check dan test runner (Vitest atau Jest) sebagai dev dependency jika diperlukan, atau gunakan via CDN/ESM untuk pengujian browser-based
    - Ekspor fungsi-fungsi murni dari `app.js` yang akan diuji (atau refactor menjadi module ES jika diperlukan)
    - _Requirements: 10.1_

  - [ ] 11.2 Jalankan dan verifikasi semua property-based tests (Properties 1–9)
    - Jalankan seluruh property tests (4.5, 4.6, 5.5, 5.6, 6.5, 6.6, 6.7, 7.4, 7.5)
    - Setiap test dijalankan minimum 100 iterasi
    - Setiap test file menggunakan tag komentar format: `// Feature: todo-list-life-dashboard, Property N: <teks>`
    - Pastikan semua property tests lulus tanpa counterexample
    - _Requirements: 1.1–11.5 (via design properties)_

  - [ ] 11.3 Verifikasi kompatibilitas browser
    - Buka `index.html` di Chrome, Firefox, Edge, dan Safari (atau gunakan BrowserStack)
    - Pastikan tidak ada error JavaScript di konsol pada semua browser
    - Pastikan fungsi localStorage, timer, dan DOM manipulation bekerja konsisten
    - _Requirements: 10.1_

  - [ ] 11.4 Siapkan repository dan deploy ke GitHub Pages
    - Pastikan `index.html` berada di root repository (bukan di subfolder)
    - Push seluruh kode ke branch `main` (atau `gh-pages`)
    - Aktifkan GitHub Pages dari Settings → Pages → Source: `main` branch, folder `/root`
    - Verifikasi: URL GitHub Pages dapat diakses, semua fitur berjalan sama seperti di lokal
    - _Requirements: 10.2, 10.3_

  - [ ] 11.5 Final checkpoint — Verifikasi deployment
    - Akses URL GitHub Pages di perangkat mobile (atau gunakan Chrome DevTools device emulation 320px)
    - Verifikasi: layout responsif, data persist via localStorage, semua fitur berfungsi
    - Verifikasi: koneksi internet dapat diputus setelah halaman dimuat → semua fitur tetap berjalan
    - Pastikan semua tests pass, tanyakan kepada user jika ada pertanyaan.
    - _Requirements: 9.1–9.5, 10.5_

## Notes

- Task bertanda `*` bersifat opsional dan dapat dilewati untuk pengerjaan MVP lebih cepat
- Setiap task merujuk ke requirement spesifik untuk kemudahan pelacakan
- Helper `safeGet()` dan `safeSet()` (task 8.1) harus diselesaikan sebelum mengerjakan module lain yang bergantung pada localStorage
- Property-based tests menggunakan library **fast-check** (JavaScript)
- Pengujian responsivitas dilakukan secara manual via browser devtools; tidak ada automated test untuk layout
- File `index.html` harus berada di root folder agar GitHub Pages deployment berjalan tanpa konfigurasi tambahan

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5"] },
    { "id": 3, "tasks": ["3.1", "3.2", "3.3"] },
    { "id": 4, "tasks": ["8.1"] },
    { "id": 5, "tasks": ["4.1", "5.1", "6.1", "7.1", "8.2"] },
    { "id": 6, "tasks": ["4.2", "4.3", "5.2", "6.2", "7.2", "8.3"] },
    { "id": 7, "tasks": ["4.4", "5.3", "6.3", "7.3"] },
    { "id": 8, "tasks": ["4.5", "4.6", "5.4", "6.4"] },
    { "id": 9, "tasks": ["5.5", "5.6", "6.5", "6.6", "6.7", "7.4", "7.5"] },
    { "id": 10, "tasks": ["10.1", "10.2", "10.3"] },
    { "id": 11, "tasks": ["10.4"] },
    { "id": 12, "tasks": ["11.1"] },
    { "id": 13, "tasks": ["11.2", "11.3"] },
    { "id": 14, "tasks": ["11.4"] },
    { "id": 15, "tasks": ["11.5"] }
  ]
}
```

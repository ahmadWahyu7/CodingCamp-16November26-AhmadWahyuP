# Requirements Document

## Introduction

To-Do List Life Dashboard adalah sebuah website satu halaman (single-page) yang berfungsi sebagai dasbor kehidupan pribadi. Website ini membantu pengguna mengorganisasi aktivitas sehari-hari melalui empat fitur utama: Greeting dengan waktu dan tanggal real-time, Focus Timer berbasis Pomodoro, To-Do List untuk manajemen tugas, dan Quick Links untuk pintasan website favorit.

Website dibangun tanpa backend menggunakan HTML, Tailwind CSS (via CDN), dan Vanilla JavaScript. Seluruh data pengguna disimpan di Local Storage browser. Website dapat di-deploy melalui GitHub Pages dan harus berjalan di Chrome, Firefox, Edge, dan Safari.

## Glossary

- **Dashboard**: Halaman utama website yang menampilkan semua fitur dalam satu tampilan.
- **Greeting_Section**: Komponen yang menampilkan salam, waktu, dan tanggal.
- **Focus_Timer**: Komponen penghitung waktu mundur berbasis teknik Pomodoro.
- **Todo_List**: Komponen untuk mencatat, mengelola, dan melacak tugas harian.
- **Quick_Links**: Komponen untuk menyimpan dan mengakses pintasan URL website favorit.
- **Theme_Manager**: Komponen yang mengelola tampilan Light Mode dan Dark Mode.
- **Local_Storage**: Mekanisme penyimpanan data di browser tanpa memerlukan backend.
- **Pomodoro**: Teknik manajemen waktu dengan sesi kerja 25 menit diikuti istirahat.
- **Task**: Satu item pekerjaan atau aktivitas dalam Todo_List.
- **Link**: Satu item pintasan berupa nama dan URL dalam Quick_Links.
- **Color_Scheme**: Kombinasi warna yang digunakan Dashboard, terdiri dari Light Mode dan Dark Mode.

---

## Requirements

### Requirement 1: Tampilan Waktu dan Tanggal Real-Time

**User Story:** Sebagai pengguna, saya ingin melihat waktu dan tanggal saat ini secara akurat, agar saya selalu tahu kondisi waktu tanpa perlu membuka aplikasi lain.

#### Acceptance Criteria

1. THE Greeting_Section SHALL menampilkan jam, menit, dan detik dalam format dua digit (contoh: 09:05:03) yang diperbarui setiap satu detik.
2. THE Greeting_Section SHALL menampilkan tanggal lengkap dalam format hari, tanggal, nama bulan, dan tahun dalam Bahasa Indonesia (contoh: Senin, 20 November 2026).
3. WHEN halaman pertama kali dimuat, THE Greeting_Section SHALL langsung menampilkan waktu dan tanggal yang sesuai dengan zona waktu perangkat pengguna dalam waktu kurang dari 1 detik.
4. IF terjadi perubahan tanggal saat halaman sedang terbuka, THEN THE Greeting_Section SHALL memperbarui tampilan tanggal secara otomatis tanpa memuat ulang halaman.
5. IF pembaruan waktu gagal atau berhenti berjalan selama lebih dari 2 detik, THEN THE Greeting_Section SHALL menampilkan indikasi bahwa waktu tidak dapat diperbarui.

---

### Requirement 2: Pesan Salam Dinamis

**User Story:** Sebagai pengguna, saya ingin menerima salam yang sesuai dengan waktu hari, agar dashboard terasa lebih personal dan kontekstual.

#### Acceptance Criteria

1. WHEN waktu berada di antara pukul 05.00 hingga 11.59, THE Greeting_Section SHALL menampilkan pesan "Selamat Pagi".
2. WHEN waktu berada di antara pukul 12.00 hingga 14.59, THE Greeting_Section SHALL menampilkan pesan "Selamat Siang".
3. WHEN waktu berada di antara pukul 15.00 hingga 17.59, THE Greeting_Section SHALL menampilkan pesan "Selamat Sore".
4. WHEN waktu berada di antara pukul 18.00 hingga 23.59 atau pukul 00.00 hingga 04.59, THE Greeting_Section SHALL menampilkan pesan "Selamat Malam".
5. WHEN waktu melewati batas pergantian periode (05.00, 12.00, 15.00, atau 18.00), THE Greeting_Section SHALL memperbarui pesan salam dalam waktu tidak lebih dari 60 detik tanpa memerlukan tindakan dari pengguna.
6. IF zona waktu perangkat pengguna tidak dapat dideteksi, THEN THE Greeting_Section SHALL menampilkan pesan "Selamat Datang" sebagai pesan salam default.

---

### Requirement 3: Nama Pengguna yang Dapat Dikustomisasi

**User Story:** Sebagai pengguna, saya ingin menambahkan nama saya di pesan salam, agar dashboard terasa lebih personal.

#### Acceptance Criteria

1. THE Greeting_Section SHALL menampilkan kolom input teks dengan panjang maksimum 50 karakter untuk memasukkan nama pengguna.
2. WHEN pengguna memasukkan nama dan menekan tombol simpan atau menekan Enter, THE Greeting_Section SHALL menampilkan nama tersebut sebagai bagian dari pesan salam (contoh: "Selamat Pagi, Ahmad!") dalam waktu kurang dari 500 milidetik.
3. THE Dashboard SHALL menyimpan nama pengguna ke Local_Storage setiap kali pengguna menyimpan perubahan nama.
4. WHEN halaman dimuat ulang, THE Greeting_Section SHALL membaca nama pengguna dari Local_Storage dan menampilkannya tanpa pengguna perlu memasukkan ulang.
5. IF pengguna mengosongkan nama dan menyimpan, THEN THE Greeting_Section SHALL menampilkan salam tanpa nama (contoh: "Selamat Pagi!").
6. IF pengguna memasukkan nama yang melebihi 50 karakter, THEN THE Greeting_Section SHALL mencegah input melampaui batas tersebut dan tidak menyimpan perubahan.
7. IF Local_Storage tidak tersedia atau gagal dibaca saat halaman dimuat, THEN THE Greeting_Section SHALL menampilkan salam tanpa nama sebagai kondisi default.

---

### Requirement 4: Focus Timer (Pomodoro)

**User Story:** Sebagai pengguna, saya ingin menggunakan timer Pomodoro untuk sesi kerja fokus, agar saya dapat mengelola waktu belajar atau bekerja dengan lebih efektif.

#### Acceptance Criteria

1. THE Focus_Timer SHALL menampilkan hitungan mundur dengan format menit:detik (MM:SS).
2. WHEN halaman pertama kali dimuat, THE Focus_Timer SHALL menampilkan durasi default 25 menit (25:00).
3. WHEN pengguna menekan tombol Start, THE Focus_Timer SHALL memulai hitungan mundur satu detik per detik dari sisa waktu yang tersisa.
4. WHEN pengguna menekan tombol Stop, THE Focus_Timer SHALL menghentikan hitungan mundur dan mempertahankan sisa waktu saat itu.
5. WHEN pengguna menekan tombol Reset, THE Focus_Timer SHALL menghentikan hitungan mundur dan mengembalikan timer ke durasi aktif yang tersimpan.
6. WHEN hitungan mundur mencapai 00:00, THE Focus_Timer SHALL berhenti secara otomatis dan menampilkan notifikasi berupa pesan di halaman yang tetap terlihat hingga pengguna menutupnya.
7. WHILE Focus_Timer sedang berjalan, THE Focus_Timer SHALL menonaktifkan tombol Start sehingga tidak dapat ditekan.
8. IF Focus_Timer tidak sedang berjalan, THEN THE Focus_Timer SHALL mengaktifkan tombol Start sehingga dapat ditekan.

---

### Requirement 5: Pengaturan Durasi Pomodoro

**User Story:** Sebagai pengguna, saya ingin mengubah durasi timer sesuai kebutuhan, agar saya bisa menyesuaikan sesi kerja dengan ritme saya sendiri.

#### Acceptance Criteria

1. THE Focus_Timer SHALL menampilkan input angka untuk mengatur durasi sesi dalam satuan menit dengan nilai minimum 1 dan nilai maksimum 120.
2. WHILE Focus_Timer dalam keadaan idle (tidak sedang berjalan), WHEN pengguna mengubah nilai input dan menekan tombol simpan atau menekan Enter, THE Focus_Timer SHALL memperbarui durasi aktif dan mereset tampilan timer ke durasi baru.
3. WHILE Focus_Timer sedang berjalan, WHEN pengguna mengubah nilai input dan menekan tombol simpan atau menekan Enter, THE Focus_Timer SHALL menerapkan durasi baru hanya setelah sesi yang sedang berjalan selesai atau dibatalkan, tanpa menginterupsi hitungan mundur yang aktif.
4. IF pengguna memasukkan nilai kurang dari 1 menit atau lebih dari 120 menit, THEN THE Focus_Timer SHALL menampilkan pesan kesalahan di bawah field input dan mempertahankan durasi sebelumnya tanpa mereset timer.
5. WHEN pengguna berhasil menyimpan durasi baru, THE Dashboard SHALL menyimpan durasi tersebut ke Local_Storage.
6. WHEN halaman dimuat ulang, THE Focus_Timer SHALL membaca durasi yang tersimpan dari Local_Storage dan menampilkan durasi tersebut sebagai nilai awal pada input dan tampilan timer.

---

### Requirement 6: Manajemen Tugas (To-Do List)

**User Story:** Sebagai pengguna, saya ingin menambahkan, mengedit, dan menghapus tugas harian, agar saya dapat melacak apa yang perlu dikerjakan.

#### Acceptance Criteria

1. THE Todo_List SHALL menampilkan kolom input teks untuk memasukkan tugas baru dengan panjang maksimum 200 karakter.
2. WHEN pengguna mengetik nama tugas dan menekan tombol tambah atau menekan Enter, THE Todo_List SHALL menambahkan Task baru ke daftar dengan status belum selesai.
3. IF pengguna menekan tombol tambah atau menekan Enter dengan kolom input kosong atau hanya berisi spasi, THEN THE Todo_List SHALL tidak menambahkan Task dan menampilkan pesan peringatan bahwa nama tugas tidak boleh kosong.
4. IF pengguna mengetik nama tugas melebihi 200 karakter, THEN THE Todo_List SHALL membatasi input sehingga karakter ke-201 dan seterusnya tidak dapat dimasukkan.
5. WHEN pengguna menekan tombol edit pada sebuah Task, THE Todo_List SHALL mengaktifkan mode edit sehingga teks tugas dapat diubah, dengan nilai awal berupa teks tugas saat ini.
6. WHEN pengguna selesai mengedit dan mengkonfirmasi perubahan, THE Todo_List SHALL memperbarui teks Task dengan nilai baru.
7. IF pengguna mengkonfirmasi perubahan dengan kolom edit kosong atau hanya berisi spasi, THEN THE Todo_List SHALL tidak menyimpan perubahan dan menampilkan pesan peringatan bahwa nama tugas tidak boleh kosong.
8. WHEN pengguna menekan tombol centang pada sebuah Task dengan status belum selesai, THE Todo_List SHALL menandai Task tersebut sebagai selesai dengan menampilkan teks dicoret.
9. WHEN pengguna menekan tombol centang pada sebuah Task dengan status selesai, THE Todo_List SHALL mengembalikan status Task ke belum selesai dan menghapus tampilan teks dicoret.
10. WHEN pengguna menekan tombol hapus pada sebuah Task, THE Todo_List SHALL menghapus Task tersebut dari daftar secara permanen.
11. THE Dashboard SHALL menyimpan seluruh data Task ke Local_Storage setiap kali terjadi perubahan (tambah, edit, selesai, hapus).
12. WHEN halaman dimuat ulang, THE Todo_List SHALL membaca data Task dari Local_Storage dan menampilkan seluruh Task yang tersimpan beserta status masing-masing.

---

### Requirement 7: Manajemen Quick Links

**User Story:** Sebagai pengguna, saya ingin menyimpan pintasan ke website yang sering saya kunjungi, agar saya dapat mengaksesnya dengan cepat dari dashboard.

#### Acceptance Criteria

1. THE Quick_Links SHALL menampilkan formulir untuk memasukkan nama link dengan panjang maksimum 50 karakter dan URL website dengan panjang maksimum 2000 karakter.
2. WHEN pengguna mengisi nama dan URL lalu menekan tombol tambah, THE Quick_Links SHALL menambahkan Link baru ke daftar pintasan.
3. IF pengguna menekan tombol tambah dengan kolom nama atau URL kosong atau hanya berisi spasi, THEN THE Quick_Links SHALL tidak menambahkan Link dan menampilkan pesan peringatan bahwa nama dan URL tidak boleh kosong.
4. IF pengguna memasukkan URL yang tidak diawali dengan "http://" atau "https://", THEN THE Quick_Links SHALL menambahkan awalan "https://" secara otomatis sebelum menyimpan.
5. WHEN pengguna mengklik sebuah Link, THE Quick_Links SHALL membuka URL tersebut di tab baru browser.
6. WHEN pengguna menekan tombol hapus pada sebuah Link, THE Quick_Links SHALL menghapus Link tersebut dari daftar secara permanen.
7. THE Dashboard SHALL menyimpan seluruh data Link ke Local_Storage setiap kali terjadi perubahan (tambah, hapus).
8. WHEN halaman dimuat ulang, THE Quick_Links SHALL membaca data Link dari Local_Storage dan menampilkan seluruh Link yang tersimpan.

---

### Requirement 8: Light Mode dan Dark Mode

**User Story:** Sebagai pengguna, saya ingin dapat memilih antara tampilan terang dan gelap, agar kenyamanan visual dashboard sesuai dengan preferensi dan kondisi pencahayaan.

#### Acceptance Criteria

1. THE Theme_Manager SHALL menampilkan tombol switch dengan ukuran area sentuh minimum 44x44 piksel untuk berpindah antara Light Mode dan Dark Mode.
2. WHEN pengguna menekan tombol switch, THE Theme_Manager SHALL mengganti Color_Scheme seluruh Dashboard dalam waktu kurang dari 300 milidetik tanpa memuat ulang halaman.
3. THE Theme_Manager SHALL menerapkan Light Mode dengan warna latar berbasis #F7E5C1 dan warna teks berbasis #1C393F pada seluruh komponen Dashboard.
4. THE Theme_Manager SHALL menerapkan Dark Mode dengan warna latar berbasis #1C393F dan warna teks berbasis #F7E5C1 pada seluruh komponen Dashboard.
5. THE Dashboard SHALL menyimpan preferensi tema yang dipilih pengguna ke Local_Storage setiap kali pengguna menekan tombol switch.
6. WHEN halaman dimuat ulang, THE Theme_Manager SHALL membaca preferensi tema dari Local_Storage dan menerapkan tema yang sesuai sebelum konten ditampilkan.
7. IF tidak ada preferensi tema yang tersimpan di Local_Storage, THEN THE Theme_Manager SHALL menerapkan Light Mode sebagai tema default.

---

### Requirement 9: Desain Responsif

**User Story:** Sebagai pengguna, saya ingin Dashboard dapat diakses dengan nyaman dari perangkat apapun, baik smartphone, tablet, maupun komputer, agar saya bisa menggunakannya kapan saja dan di mana saja.

#### Acceptance Criteria

1. THE Dashboard SHALL menerapkan pendekatan mobile-first dalam tata letak, dimulai dari tampilan layar dengan lebar minimum 320px lalu menyesuaikan ke layar lebih besar.
2. WHILE lebar layar kurang dari 768px, THE Dashboard SHALL menampilkan seluruh komponen dalam satu kolom vertikal secara berurutan tanpa overflow horizontal.
3. WHILE lebar layar 768px hingga 1023px, THE Dashboard SHALL menyusun komponen dalam tata letak dua kolom.
4. WHILE lebar layar 1024px ke atas, THE Dashboard SHALL menampilkan seluruh komponen dalam tata letak multi-kolom yang memanfaatkan seluruh lebar area konten.
5. THE Dashboard SHALL dapat dioperasikan sepenuhnya menggunakan sentuhan jari pada perangkat mobile, dengan area sentuh minimum 44x44 piksel untuk setiap tombol interaktif.

---

### Requirement 10: Kompatibilitas Browser dan Deployment

**User Story:** Sebagai pengguna, saya ingin Dashboard berjalan dengan baik di browser yang saya gunakan sehari-hari dan dapat diakses secara online, agar tidak terbatas pada satu perangkat atau lingkungan tertentu.

#### Acceptance Criteria

1. THE Dashboard SHALL berjalan tanpa error JavaScript di browser Chrome (versi terbaru), Firefox (versi terbaru), Edge (versi terbaru), dan Safari (versi terbaru).
2. THE Dashboard SHALL dapat di-deploy dan diakses melalui GitHub Pages tanpa konfigurasi backend.
3. THE Dashboard SHALL memuat Tailwind CSS hanya melalui CDN tanpa memerlukan proses build atau instalasi dependency.
4. THE Dashboard SHALL memiliki struktur folder dengan tepat satu file CSS di dalam folder `css/` dan tepat satu file JavaScript di dalam folder `js/`.
5. IF koneksi internet tidak tersedia setelah halaman berhasil dimuat, THEN THE Dashboard SHALL tetap berfungsi penuh karena semua logika berjalan di sisi klien menggunakan Local_Storage.

---

### Requirement 11: Tipografi dan Visual

**User Story:** Sebagai pengguna, saya ingin Dashboard memiliki tampilan yang bersih, modern, dan estetis, agar pengalaman menggunakannya terasa menyenangkan dan tidak membosankan.

#### Acceptance Criteria

1. THE Dashboard SHALL menggunakan font Lato dari Google Fonts untuk seluruh teks konten.
2. THE Dashboard SHALL menggunakan font Luckiest Guy dari Google Fonts untuk tampilan angka pada Focus_Timer.
3. THE Dashboard SHALL menerapkan rounded corners pada seluruh komponen kartu dan tombol dengan border-radius minimum 8px.
4. THE Dashboard SHALL menerapkan box-shadow pada komponen kartu untuk menciptakan kesan kedalaman visual.
5. THE Dashboard SHALL menerapkan padding minimum 16px dan margin antar komponen minimum 16px agar setiap elemen tidak bersentuhan langsung satu sama lain.

# Dokumentasi

## Informasi Penting
Berhubung session AI Agentic saya terbatas, kebanyakan AI Agentic yang saya gunakan itu hanya untuk Design & Visual. >60% dari hasil project ini saya harus coding manual & menggunakan AI as assistant.

## Struktur Folder

### src/assets
Tempat dimana file2 statis disimpan

### src/modules/<domain_name>
Disini saya pisah berdasarkan "domain" atau "business module". Dalam kasus ini, "domain" saya pisah menjadi

- **auth** -> Modul untuk autentikasi/autorisasi user.
- **core** -> Modul yang objek-objek di dalamnya bersifat "dasar" atau sebagai "building blocks" modul-modul lain. Contoh objek pada modul ini adalah Button, Navbar, Sidebar, dll.
- **lib** -> Modul yang bersifat sebagai "pembantu"(utils).
- **products** -> Modul yang berisikan Business Logic dari domain "product"

### src/modules/<domain_name>/components
Disini adalah tempat dimana komponen "reusable" dari "domain" spesifik berada. Contoh untuk bisa mendapatkan informasi user yang ter-login & fungsionalitas untuk "logout" bisa ditemukan di src/modules/auth/components/ProfileAvatar.tsx

### src/modules/<domain_name>/pages
Disini adalah tempat dimana komponen yang besar(Page Layer, biasanya tidak reusable) tinggal. Contoh nya adalah LoginPage dan DashboardLayout.

### src/modules/<domain_name>/services
Disini adalah tempat dimana "fetchers" atau function yang bertanggung jawab untuk melakukan Request ke server (CRUD). Saya menggunakan model React Hook agar mudah digunakan di komponen atau bahkan service lain.

### src/modules/<domain_name>/stores
Disini adalah tempat dimana "stores" atau "context" suatu state tinggal. Saya menggunakan store untuk menampung data Profil user dan Produk agar kita dapat dengan mudah mendapatkan data nya secara "reliable"(Data binding template <-> controller synced)

## Teknologi
- **Design System** -> ShadCN UI + TailwindCSS + Lucide Icons + Sonner Toast(Notifications)
- **Form** -> React Hook Form
- **HTTP Client** -> Axios
- **Context** -> Zustand
- **Routing** -> React Router
- **AI Agentic & Assistant** -> Claude Code & Claude

## Konstrain
- dummyJSON hanya melakukan "mock" kepada operasi "POST", "PUT", "PATCH", dan "DELETE". Jadi walaupun request HTTP saya berhasil(terkonfirmasi dari network tab devtools), perubahan data tidak terlihat.
- dummyJSON tidak secara otomatis set "accessToken" pada cookie dengan atribut "httpOnly" dan "secure". Jadi untuk sekarang saya hanya taruh access & refresh token di localStorage.
- Dari hasil tes saya, deployment di Vercel sering mengakibatkan fetching data dari dummyJSON agak pelan. Mohon kesabarannya 🙏.

## Flow
### HTTP Requests
1. Pada src/modules/core/services/api.ts, tersedia 2 jenis "base" api. 1 untuk mengakses endpoint publik(/login), 1 untuk mengakses endpoint terjaga.
2. Tiap kali aplikasi melakukan HTTP request ke endpoint yang terjaga, aplikasi harus melakukan: **cek apabila accessToken expire** -> **refresh** -> **retry**. Apabila ketika retry masih mendapatkan error 401(Unauthorized), hapus semua token dan redirect user ke Login Page
3. Untuk mengkonfirmasi ini, hapus accessToken & refreshToken di localStorage lewat devTools dan lakukan operasi create/update/delete, user akan ter-redirect ke Login Page

### User Belum Pernah Login
1. Aplikasi akan melakukan HTTP request untuk pengambilan Profile. Apabila gagal, berarti access/refresh token mereka invalid. Redirect user ke Login page.

### User Sudah Pernah Login
1. Aplikasi akan melakukan HTTP request untuk pengambilan Profile. Apabila berhasil, berarti access/refresh token mereka valid. Redirect user ke Dashboard page.

### User Login
1. Aplikasi akan melakukan HTTP request ke /login menggunakan useAuthService.login. Apabila berhasil, aplikasi akan melakukan request tambahan menggunakan useAuthService.getProfile dan update useAuthStore dengan menggunakan data profile.

### User Logout
1. Pada Navbar, tekan gambar profile di kanan atas, pilih "logout".
2. Aplikasi akan melakukan HTTP request via useAuthService.logout
3. Aplikasi akan clear localStorage
4. Aplikasi akan redirect ke Login Page.

### Product Browsing
1. Aplikasi akan melakukan HTTP request via useProductsService.getProducts dan hasil nya akan disimpan di useProductsStore agar dengan mudah bisa diakses di seluruh aplikasi.
2. Aplikasi akan melakukan refetch apabila terdeteksi pergantian pada "currentPage" dan "currentQuery" dari useProductsStore.

### Product Details
1. Aplikasi akan memunculkan "dialog" ketika Product Card di tekan. Data pada dialog meng-utilisasi useProductsStore.

### Product Add
1. Tekan Tombol "Add Product"
2. Isi Form
3. Aplikasi akan melakukan HTTP request menggunakan useProductsService.createProduct. Apabila berhasil, akan ada notification muncul dan product list akan di refresh dengan cara mengubah page ke 1 dan clear search query.

### Product Edit
1. Tekan Button "Pensil" pada kanan atas product card
2. Aplikasi akan melakukan HTTP request menggunakan useProductsService.updateProductById. Apabila berhasil, akan ada notification muncul dan product list akan di refresh dengan cara mengubah page ke 1 dan clear search query.

### Product Delete
1. Tekan Button "Sampah" pada kanan atas product card
2. Aplikasi akan melakukan HTTP request menggunakan useProductsService.deleteProductById. Apabila berhasil, akan ada notification muncul dan product list akan di refresh dengan cara mengubah page ke 1 dan clear search query.

## Requirements
- Node 24(LTS)

## Commands
### Init
npm i

### Development Server
npm run dev

### Build
npm run build
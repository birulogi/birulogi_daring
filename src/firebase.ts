import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";

// ==========================================
// KONFIGURASI FIREBASE ANDA
// Silakan isi variabel di bawah ini dengan config dari Firebase Console Anda.
// ==========================================
const firebaseConfig = {
  apiKey: "SIMULASI_API_KEY",
  authDomain: "simulasi-domain.firebaseapp.com",
  projectId: "simulasi-project",
  storageBucket: "simulasi-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// ==========================================
// SIMULASI DATA (Mock) UNTUK DEMONSTRASI BARISAN KODE
// Struktur ini adalah contoh data JSON di Firestore:
// Collection: "peserta_didik"
// Document ID: (Auto Generate / Bebas)
// ==========================================
const mockDataPesertaDidik = [
  { nis: "1001", nama: "Anisa Rahmawati", password: "1001" },
  { nis: "1002", nama: "Budi Santoso", password: "1002" },
  { nis: "1003", nama: "Citra Kirana", password: "1003" },
  { nis: "201020", nama: "Developer Birulogi", password: "201020" }
];

let db: any = null;

try {
  // Hanya inisialisasi jika apiKey bukan "SIMULASI_API_KEY"
  if (firebaseConfig.apiKey !== "SIMULASI_API_KEY") {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
} catch (error) {
  console.error("Gagal menginisialisasi Firebase:", error);
}

// Service untuk Login
export const loginPesertaDidik = async (nis: string, password: string) => {
  if (db) {
    try {
      const q = query(collection(db, "peserta_didik"), where("nis", "==", nis), where("password", "==", password));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (err) {
      console.error(err);
      throw new Error("Terjadi kesalahan sistem saat mencoba login.");
    }
  } else {
    // Simulasi respons (KONDISI MOCK)
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const found = mockDataPesertaDidik.find((p) => p.nis === nis && p.password === password);
        resolve(!!found);
      }, 800);
    });
  }
};

// Service untuk Cari NIS
export const cariNISBerdasarkanNama = async (nama: string) => {
  if (db) {
    try {
      // Hati-hati: Pencarian string di Firestore bersifat case-sensitive.
      // Anda mungkin perlu ekstensi algolia atau menyimpan nama dalam huruf kecil
      // Untuk tujuan ini, kita gunakan pendekatan where equality biasa sebagai contoh.
      const q = query(collection(db, "peserta_didik"), where("nama", "==", nama));
      const querySnapshot = await getDocs(q);
      
      const results: string[] = [];
      querySnapshot.forEach((doc) => {
        results.push(doc.data().nis);
      });
      return results;
    } catch (err) {
      console.error(err);
      throw new Error("Terjadi kesalahan sistem saat mencoba mencari NIS.");
    }
  } else {
    // Simulasi respons (KONDISI MOCK)
    return new Promise<string[]>((resolve) => {
      setTimeout(() => {
        const results = mockDataPesertaDidik
          .filter((p) => p.nama.toLowerCase().includes(nama.toLowerCase()))
          .map(p => p.nis);
        resolve(results);
      }, 800);
    });
  }
};

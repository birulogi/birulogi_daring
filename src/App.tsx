/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { BookOpen, User, Lock, Search, GraduationCap } from 'lucide-react';
import { loginPesertaDidik, cariNISBerdasarkanNama } from './firebase';

type TabState = 'login' | 'cekNis';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabState>('login');
  
  // States for Login
  const [nis, setNis] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // States for Cek NIS
  const [namaLengkap, setNamaLengkap] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  // Handler for Login Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nis || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'NIPD/NIS dan Password wajib diisi!',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    setIsLoggingIn(true);
    try {
      const isSuccess = await loginPesertaDidik(nis, password);
      if (isSuccess) {
        Swal.fire({
          icon: 'success',
          title: 'Login Berhasil!',
          text: 'Selamat datang kembali.',
          background: '#1e293b',
          color: '#fff',
          confirmButtonColor: '#3b82f6',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          // Lakukan aksi navigasi selanjutnya (contoh reset form sementara)
          setNis('');
          setPassword('');
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Akses Ditolak',
          text: 'NIPD/NIS atau Password salah. Silakan coba lagi.',
          background: '#1e293b',
          color: '#fff',
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Kesalahan Sistem',
        text: error.message || 'Gagal terhubung ke database.',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handler for Cek NIS Submit
  const handleCekNis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaLengkap) {
      Swal.fire({
        icon: 'info',
        title: 'Perhatian',
        text: 'Silakan masukkan Nama Lengkap terlebih dahulu.',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    setIsChecking(true);
    try {
      const results = await cariNISBerdasarkanNama(namaLengkap);
      
      if (results.length > 0) {
        const nisString = results.join(', ');
        Swal.fire({
          icon: 'success',
          title: 'NIS Ditemukan!',
          html: `NIPD/NIS milik <strong>${namaLengkap}</strong> adalah:<br><br><span style="font-size: 1.5rem; font-weight: bold; padding: 0.5rem 1rem; background: #0f172a; border-radius: 0.5rem; display: inline-block; color: #60a5fa">${nisString}</span>`,
          background: '#1e293b',
          color: '#fff',
          confirmButtonColor: '#3b82f6'
        });
        setNamaLengkap('');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Tidak Ditemukan',
          text: `Peserta didik dengan nama "${namaLengkap}" tidak ditemukan dalam sistem.`,
          background: '#1e293b',
          color: '#fff',
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Kesalahan Sistem',
        text: error.message || 'Gagal mencari data.',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="gradient-mesh min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-8 text-white">
      <header className="text-center mt-4 sm:mt-8">
        <div className="flex items-center justify-center mb-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-blue-500/30">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Portal Akademik</h1>
        </div>
        <p className="text-blue-200/60 font-medium tracking-wide text-sm">Dashboard Pembelajaran Peserta Didik Modern</p>
      </header>

      <main className="w-full max-w-md my-8 flex-grow flex flex-col justify-center">
        <div className="glass p-1 mb-6 flex shrink-0">
          <button
            onClick={() => setActiveTab('login')}
            className={`transition-all duration-200 flex-1 py-3 text-sm font-semibold rounded-xl ${
              activeTab === 'login' ? 'active-tab' : 'text-white/50 hover:bg-white/10'
            }`}
          >
            Login Akun
          </button>
          <button
            onClick={() => setActiveTab('cekNis')}
            className={`transition-all duration-200 flex-1 py-3 text-sm font-semibold rounded-xl ${
              activeTab === 'cekNis' ? 'active-tab' : 'text-white/50 hover:bg-white/10'
            }`}
          >
            Cek NIS
          </button>
        </div>

        <div className="glass p-8 shadow-2xl relative overflow-hidden">
          {/* LOGIN TAB */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <h2 className="text-xl font-semibold mb-6 text-center">Selamat Datang Kembali</h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-blue-300/80 ml-1">
                    Username (NIS)
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="Masukkan NIS Anda"
                      value={nis}
                      onChange={(e) => setNis(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-blue-300/80 ml-1">
                    Kata Sandi (Default: NIS)
                  </label>
                  <div className="relative group">
                    <input
                      type="password"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all mt-4 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sedang Memproses...
                  </>
                ) : (
                  'Masuk Ke Dashboard'
                )}
              </button>
            </form>
          )}

          {/* CEK NIS TAB */}
          {activeTab === 'cekNis' && (
            <form onSubmit={handleCekNis} className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <h2 className="text-xl font-semibold mb-6 text-center">Cari NIS Anda</h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-blue-300/80 ml-1">
                    Nama Lengkap Peserta Didik
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="Contoh: Ahmad Subardjo"
                      value={namaLengkap}
                      onChange={(e) => setNamaLengkap(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-white/40 italic pt-1 ml-1">*Gunakan nama lengkap sesuai ijazah atau akta kelahiran.</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isChecking}
                className="w-full border border-blue-500 text-blue-400 hover:bg-blue-500/10 font-bold py-3.5 rounded-xl transition-all mt-4 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isChecking ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mencari...
                  </>
                ) : (
                  'Temukan Nomor Induk'
                )}
              </button>
            </form>
          )}

        </div>
      </main>

      <footer className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center text-xs text-white/30 border-t border-white/5 pt-6 pb-2 gap-4 shrink-0">
        <div className="flex gap-4">
          <span className="hover:text-white/50 cursor-pointer transition-colors">Panduan Pengguna</span>
          <span className="hover:text-white/50 cursor-pointer transition-colors">Kontak Admin</span>
        </div>
        <div className="font-black tracking-widest uppercase text-white/50">birulogi</div>
        <div>&copy; {new Date().getFullYear()} Instansi Pendidikan</div>
      </footer>
    </div>
  );
}


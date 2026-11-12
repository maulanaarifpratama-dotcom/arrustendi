// Sumber data tunggal pemasukan waqaf.
// Update berikutnya: tambah baris ke DONORS (urutan = urutan masuk),
// lalu sesuaikan WAQAF.unlisted dan WAQAF.updated. Semua angka di situs
// (hero, gauge, ledger, sticky bar, meta) dihitung dari sini.

import donorsData from './donors.json';
import settings from './settings.json';

export interface Donor {
  n: string;
  v: number;
}

export const DONORS: Donor[] = donorsData.donors;

/** Mitra kelembagaan: nama harus persis sama dengan entri DONORS di atas. */
export const PARTNERS = [
  {
    name: 'Bank DKI',
    logo: '/images/mitra/bank-dki.svg',
    note: 'Donasi korporasi Rp 7.500.000',
    donorName: 'Bank DKI'
  },
  {
    name: 'BAZNAS',
    logo: '/images/mitra/baznas.svg',
    note: 'Penyaluran zakat Rp 10.000.000',
    donorName: 'BAZNAS (Zakat)'
  }
];

export const WAQAF = { ...settings };

export const rollTotal = DONORS.reduce((s, d) => s + d.v, 0);
export const totalWaqaf = rollTotal + WAQAF.unlisted;
export const danaProgres = totalWaqaf + WAQAF.modalAwal;
export const persen = (danaProgres / WAQAF.totalRAB) * 100;
export const sisa = WAQAF.totalRAB - danaProgres;

export const rupiah = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID');
export const persenID = (n: number) => n.toFixed(1).replace('.', ',');

export const waqafState = {
  ...WAQAF,
  rollTotal,
  totalWaqaf,
  danaProgres,
  persen,
  sisa
};

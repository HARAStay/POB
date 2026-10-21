import {seedPersonName} from './core.js';
const areas={'Pos security':'Pos keamanan',Office:'Kantor',Dormitory:'Asrama',Warehouse:'Gudang'};
const generated=[['Raka Demo','Raka Prasetyo'],['Admin Demo','Administrator'],['Nina Demo','Nina'],['Rizal Demo','Rizal'],['dr. Rani Demo','dr. Rani'],['dr. Bayu Demo','dr. Bayu'],['Simulasi alat DCU','Alat pemeriksaan DCU'],['Manual petugas','Diisi petugas'],['Profil simulasi v1','Aturan pemeriksaan versi 1'],['Sistem demo','Sistem'],['Data contoh disiapkan','Data awal disiapkan'],['Riwayat contoh hari sebelumnya','Catatan masuk keluar'],['di atas batas demo','di atas batas pemeriksaan'],['di bawah batas demo','di bawah batas pemeriksaan'],['pada profil demo','pada aturan pemeriksaan'],['di luar rentang demo','di luar batas pemeriksaan'],['Antrean offline','Menunggu koneksi'],['Titik offline: transaksi masuk antrean perangkat demo','Koneksi terputus: catatan menunggu pengiriman'],[' · disinkronkan dari antrean demo',' · dikirim setelah koneksi pulih'],['Sinkronisasi demo','Pengiriman catatan tertunda'],['Terbuka (simulasi)','Pintu terbuka'],['Tidak dibuka (simulasi)','Pintu tidak dibuka']];
export const areaName=value=>areas[value]||value;
const clean=value=>typeof value==='string'?generated.reduce((s,[a,b])=>s.split(a).join(b),Object.entries(areas).reduce((s,[a,b])=>s.split(a).join(b),value)):value;
export function normalizeStoredLabels(s){
 for(const p of s.people||[]){p.area=areaName(p.area);const n=Number(p.id?.replace(/^DMF-/,''));if(n>300&&n<=650){const expected=seedPersonName(n),old=expected.replace(/ (Kusuma|Nugraha)$/,' '+n);if(p.name===old)p.name=expected;}if(p.name==='Raka Demo')p.name='Raka Prasetyo';}
 for(const e of s.events||[]){e.area=areaName(e.area);e.message=clean(e.message);e.result=clean(e.result);e.gate=clean(e.gate);}
 for(const p of s.pending||[])p.area=areaName(p.area);
 for(const m of s.measurements||[]){m.source=clean(m.source);m.rulesLabel=clean(m.rulesLabel);m.actor=clean(m.actor);if(m.evaluation?.flags)m.evaluation.flags=m.evaluation.flags.map(clean);}
 for(const c of s.cases||[]){if(c.ack)c.ack.actor=clean(c.ack.actor);for(const a of c.actions||[])a.actor=clean(a.actor);}
 for(const a of s.accounts||[]){a.name=clean(a.name);if(['admin','security','nurse','doctor','doctor2'].includes(a.id))a.username=a.username?.replace(/\.demo$/,'');}
 for(const d of s.devices||[]){d.area=areaName(d.area);d.name=clean(d.name)?.replace(/^Reader /,'Pembaca ');}
 for(const a of s.audit||[]){a.actor=clean(a.actor);a.action=clean(a.action);}
 return s;
}

export function describeChange(detail){
 const labels={id:'Nomor catatan',personId:'Nomor personel',eventId:'Nomor catatan masuk keluar',targetId:'Catatan yang diperbaiki',requestId:'Nomor pengajuan',caseId:'Nomor kasus',before:'Sebelum perubahan',after:'Setelah perubahan',reason:'Alasan',note:'Catatan dokter',name:'Nama',company:'Perusahaan',home:'CPP penugasan',employmentNo:'Nomor personel',site:'CPP',area:'Area',active:'Status aktif',archived:'Status arsip',replaceCard:'Ganti kartu',replaceBarcode:'Ganti barcode',positionVerified:'Posisi telah diverifikasi',kind:'Jenis',direction:'Arah',role:'Peran',username:'Nama pengguna',sys:'Tekanan darah atas',dia:'Tekanan darah bawah',spo2:'Saturasi oksigen',temp:'Suhu tubuh',rr:'Frekuensi napas'};
 const words={admin:'Administrator',security:'Petugas keamanan',nurse:'Petugas pemeriksaan',doctor:'Dokter',in:'Masuk',out:'Keluar',allowed:'Diizinkan bekerja',held:'Belum diizinkan bekerja',observe:'Masih dalam pemeriksaan',measurementVoid:'Pembatalan hasil pemeriksaan',measurementCorrection:'Koreksi hasil pemeriksaan',actionVoid:'Pembatalan tindakan',actionCorrection:'Koreksi tindakan',Reader:'Pembaca kartu dan barcode',DCU:'Alat pemeriksaan kesehatan'};
 const format=value=>value===null?'Belum diisi':typeof value==='boolean'?(value?'Ya':'Tidak'):Array.isArray(value)?value.map(format).join(', '):typeof value==='object'?Object.entries(value).map(([k,v])=>(labels[k]||k)+': '+format(v)).join(' · '):(words[value]||String(value));
 try{return format(JSON.parse(detail));}catch{return String(detail).replace(/ · (allowed|held|observe|admin|security|nurse|doctor)$/,(_,k)=>' · '+words[k]);}
}

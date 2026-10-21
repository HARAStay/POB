export const AREAS=['Pos keamanan','Kantor','Asrama','Ruang makan / dapur','Virsatile','Area CPP','Gudang','Klinik'];
export const SITES=['Donggi','Matindok'];
export const PROFILES={admin:{name:'Administrator',label:'Administrator'},security:{name:'Rizal',label:'Petugas keamanan'},nurse:{name:'Nina',label:'Petugas DCU'},doctor:{name:'dr. Rani',label:'Dokter klinik'}};
export const DEFAULT_RULES={sysHigh:140,diaHigh:90,sysUrgent:180,diaUrgent:120,sysLow:90,diaLow:60,spo2Low:96,tempHigh:38,tempLow:36,rrLow:12,rrHigh:20};
export const medical=role=>['admin','nurse','doctor'].includes(role);
export const clinician=role=>['admin','doctor'].includes(role);
export const today='2026-10-22';
export function stamp(s){s.clock+=20000;return new Date(s.clock).toISOString();}
export function audit(s,actor,action,detail){s.audit.unshift({id:'AUD-'+s.seq++,time:stamp(s),actor,action,detail});}
export function seedPersonName(n){const fn=['Arif','Budi','Sari','Dimas','Ratna','Fajar','Dewi','Rizky','Lina','Adi','Nadia','Bayu','Putri','Yoga','Indah','Hendra','Rina','Taufik','Maya','Deni'],ln=['Pratama','Santoso','Utami','Saputra','Lestari','Wijaya','Permata','Kusuma','Nugraha','Wibowo','Rahma','Setiawan','Pertiwi','Maulana','Kurnia'];return fn[(n-1)%20]+' '+ln[Math.floor((n-1)/20)%15]+(n>300?' '+(n<=600?'Kusuma':'Nugraha'):'');}
export function makeSeed(){
 const s={schema:1,clock:Date.parse('2026-10-22T08:15:00+07:00'),seq:1000,people:[],events:[],measurements:[],cases:[],audit:[],rules:{...DEFAULT_RULES},connections:{Donggi:true,Matindok:true},settings:{sound:false}};
 const fn=['Arif','Budi','Sari','Dimas','Ratna','Fajar','Dewi','Rizky','Lina','Adi','Nadia','Bayu','Putri','Yoga','Indah','Hendra','Rina','Taufik','Maya','Deni'];const ln=['Pratama','Santoso','Utami','Saputra','Lestari','Wijaya','Permata','Kusuma','Nugraha','Wibowo','Rahma','Setiawan','Pertiwi','Maulana','Kurnia'];
 const counts=[[4,25,36,18,8,26,10,3],[3,22,31,15,6,28,9,4]];
 for(let si=0;si<2;si++)for(let j=0;j<325;j++){
  const n=si*325+j+1;const id='DMF-'+String(n).padStart(4,'0');const category=j<80?'Internal':j<310?'Mitra kerja':'Tamu';const company=category==='Internal'?'Pertamina':category==='Tamu'?'PT Tamu Contoh':['PT Mitra Energi','PT Teknik Nusantara','PT Karya Mandiri'][j%3];let zone=null,cursor=0;
  for(let a=0;a<8;a++){cursor+=counts[si][a];if(j<cursor){zone=AREAS[a];break;}}
  const inside=j<counts[si].reduce((a,b)=>a+b,0);const p={id,name:seedPersonName(n),category,company,home:SITES[si],card:'CARD-'+String(n).padStart(4,'0'),barcode:id,active:true,expires:category==='Tamu'?today:null,site:inside?SITES[si]:null,area:inside?zone:null,last:'2026-10-22T00:00:00.000Z'};s.people.push(p);
  if(inside){s.events.unshift({id:'EVT-'+s.seq++,personId:id,site:p.site,area:'SITE',direction:'in',method:'Kartu',time:'2026-10-21T23:00:00.000Z',result:'Berhasil',message:'Masuk kawasan CPP'});s.events.unshift({id:'EVT-'+s.seq++,personId:id,site:p.site,area:p.area,direction:'in',method:'Kartu',time:p.last,result:'Berhasil',message:'Masuk '+p.area});}
 }
 s.people[0].name='Arif Pratama';s.people[1].name='Budi Santoso';s.people[2].name='Sari Utami';s.people[200].name='Raka Prasetyo';
 for(let i=0;i<70;i++){const p=s.people[i<40?i:325+i-40];const bad=[1,4,329].includes(s.people.indexOf(p));const values={sys:118+i%10,dia:74+i%5,spo2:98,temp:bad?38.2:36.6,rr:16};const m={id:'DCU-'+s.seq++,personId:p.id,site:p.home,values,source:i%9===0?'Diisi petugas':'Alat pemeriksaan DCU',time:'2026-10-22T00:10:00.000Z',actor:'Nina',evaluation:evaluate(values,s.rules),ruleSnapshot:{...s.rules},rulesLabel:'Aturan pemeriksaan versi 1',corrections:[]};s.measurements.unshift(m);if(bad){const c={id:'KLINIK-'+s.seq++,measurementId:m.id,personId:p.id,site:p.home,created:m.time,status:'new',ack:null,actions:[]};s.cases.unshift(c);}}
 audit(s,'Sistem','Data awal disiapkan','650 identitas terdaftar.');return s;
}
export function evaluate(v,r){
 const invalid=['sys','dia','spo2','temp','rr'].filter(k=>!Number.isFinite(v[k]));if(invalid.length)return {level:'incomplete',flags:['Data belum lengkap'],category:'Data belum lengkap'};
 const flags=[];let level='clear';const flag=(text,urgent=false)=>{flags.push(text);if(urgent)level='urgent';else if(level!=='urgent')level='review';};
 if(v.sys>r.sysUrgent||v.dia>r.diaUrgent)flag('Tekanan darah sangat tinggi pada aturan pemeriksaan',true);else if(v.sys>=r.sysHigh||v.dia>=r.diaHigh)flag('Tekanan darah di atas batas pemeriksaan');
 if(v.sys<=r.sysLow||v.dia<=r.diaLow)flag('Tekanan darah rendah pada aturan pemeriksaan');if(v.spo2<r.spo2Low)flag('Saturasi oksigen di bawah batas pemeriksaan');if(v.temp>=r.tempHigh)flag('Suhu di atas batas pemeriksaan');if(v.temp<=r.tempLow)flag('Suhu di bawah batas pemeriksaan');if(v.rr<r.rrLow||v.rr>r.rrHigh)flag('Frekuensi napas di luar batas pemeriksaan');
 const category=v.sys>180||v.dia>120?'Sangat tinggi':v.sys>=140||v.dia>=90?'Tahap 2':v.sys>=130||v.dia>=80?'Tahap 1':v.sys>=120?'Meningkat':'Normal menurut kategori AHA';
 return {level,flags,category};
}
export function findPerson(s,credential){const key=credential.trim().toUpperCase();return s.people.find(p=>[p.card,p.barcode].some(v=>v.toUpperCase()===key));}
export function scan(s,input,actor){
 const p=findPerson(s,input.credential);const t=stamp(s);let message='',result='Berhasil';let accepted=false;
 if(!p){const revoked=s.people.find(x=>(x.revokedCredentials||[]).some(r=>r.value.toUpperCase()===input.credential.trim().toUpperCase()));message=revoked?'Kartu atau barcode lama sudah dicabut':'Kartu atau barcode tidak dikenal';result='Ditolak';}
 else if(!p.active||p.archived){message='Identitas nonaktif';result='Ditolak';}
 else if((p.expires&&p.expires<today)||(p.endDate&&p.endDate<today)){message=p.expires&&p.expires<today?'Masa berlaku identitas tamu sudah berakhir':'Masa penugasan sudah berakhir';result='Ditolak';}
 else if(!s.connections[input.site]){message='Koneksi terputus: catatan menunggu pengiriman';result='Menunggu koneksi';s.pending??=[];s.pending.push({...input,id:'QUEUE-'+s.seq++,actor,queuedAt:t});}
 else{
  const enter=input.direction==='in';const siteGate=input.area==='SITE';
  if(enter&&siteGate){if(p.site){message='Masuk berulang atau belum keluar CPP sebelumnya';result='Perlu verifikasi';}else{p.site=input.site;p.area=null;message='Masuk kawasan; belum tercatat masuk area';accepted=true;}}
  else if(!p.site||p.site!==input.site){message=enter?'Belum tercatat masuk kawasan ini':'Keluar tanpa catatan masuk kawasan ini';result='Perlu verifikasi';}
  else if(siteGate&&!enter){if(p.area){message='Belum tercatat keluar dari '+p.area;result='Perlu verifikasi';}else{p.site=null;p.area=null;message='Keluar kawasan CPP';accepted=true;}}
  else if(enter){if(p.area){message=p.area===input.area?'Masuk berulang di area yang sama':'Belum tercatat keluar dari '+p.area;result='Perlu verifikasi';}else{p.area=input.area;message='Masuk '+input.area;accepted=true;}}
  else if(p.area!==input.area){message='Keluar tanpa catatan masuk '+input.area;result='Perlu verifikasi';}
  else{p.area=null;message='Keluar '+input.area+'; masih di kawasan';accepted=true;}
 }
 if(accepted)p.last=t;const e={id:'EVT-'+s.seq++,personId:p?.id||null,credential:input.credential,site:input.site,area:input.area,direction:input.direction,method:input.method,time:t,result,message,gate:accepted?'Pintu terbuka':'Pintu tidak dibuka'};s.events.unshift(e);audit(s,actor,'Pemindaian '+(input.direction==='in'?'masuk':'keluar'),e.id+' · '+message);return e;
}
export function addMeasurement(s,payload,actor){
 const p=s.people.find(x=>x.id===payload.personId);if(!p)throw Error('Pilih identitas yang terdaftar.');if((!p.active||p.archived)&&!payload.historicalCorrection)throw Error('Personel nonaktif tidak dapat menjalani pemeriksaan baru.');const v=payload.values;
 const ranges={sys:[40,300],dia:[20,200],spo2:[50,100],temp:[30,45],rr:[1,80]};
 for(const k of Object.keys(ranges)){if(v[k]!==null&&(!Number.isFinite(v[k])||v[k]<ranges[k][0]||v[k]>ranges[k][1]))throw Error('Periksa angka '+k+'. Angka berada di luar rentang masukan yang dapat diterima.');}
 if(v.sys!==null&&v.dia!==null&&v.sys<=v.dia)throw Error('Sistolik harus lebih besar daripada diastolik.');
 const m={id:'DCU-'+s.seq++,personId:p.id,site:payload.site,values:{...v},source:payload.source,time:stamp(s),actor,evaluation:evaluate(v,s.rules),ruleSnapshot:{...s.rules},rulesLabel:'Aturan pemeriksaan versi 1',corrections:[]};s.measurements.unshift(m);
 if(['review','urgent'].includes(m.evaluation.level))s.cases.unshift({id:'KLINIK-'+s.seq++,measurementId:m.id,personId:p.id,site:m.site,created:m.time,status:'new',ack:null,actions:[]});audit(s,actor,'Pemeriksaan DCU disimpan',m.id+' · '+p.id+' · '+m.source);return m;
}
export function acknowledge(s,caseId,actor){const c=s.cases.find(x=>x.id===caseId);if(!c)throw Error('Kasus tidak ditemukan.');if(c.status==='new'){c.status='ongoing';c.ack={actor,time:stamp(s)};audit(s,actor,'Alarm klinik diterima',c.id);}return c;}
export function addAction(s,caseId,{note,decision,recheck},actor){const c=s.cases.find(x=>x.id===caseId);if(!c)throw Error('Kasus tidak ditemukan.');if(['void','replaced'].includes(c.status))throw Error('Kasus sumber sudah tidak aktif.');if(c.status==='new')throw Error('Terima kasus terlebih dahulu.');if(!note.trim())throw Error('Isi hasil pemeriksaan atau tindakan dokter.');if(!['observe','allowed','held'].includes(decision))throw Error('Keputusan tidak valid.');const a={id:'ACT-'+s.seq++,note:note.trim(),decision,recheck:recheck.trim(),actor,time:stamp(s)};c.actions.push(a);c.status=decision==='observe'?'ongoing':'closed';audit(s,actor,'Tindakan dan keputusan dokter',c.id+' · '+decision);return a;}
export function reconcile(s,personId,{site,area,reason},actor){if(!reason.trim())throw Error('Alasan koreksi wajib diisi.');const p=s.people.find(x=>x.id===personId);if(!p)throw Error('Identitas tidak ditemukan.');const before={site:p.site,area:p.area};p.site=site||null;p.area=site?(area||null):null;p.last=stamp(s);audit(s,actor,'Koreksi lokasi',JSON.stringify({personId,before,after:{site:p.site,area:p.area},reason:reason.trim()}));return p;}
export function syncSite(s,site,actor){s.connections[site]=true;const q=(s.pending||[]).filter(x=>x.site===site);s.pending=(s.pending||[]).filter(x=>x.site!==site);for(const input of q){const e=scan(s,input,actor);e.queuedAt=input.queuedAt;e.syncedAt=e.time;e.time=input.queuedAt;e.message+=' · dikirim setelah koneksi pulih';}audit(s,actor,'Pengiriman catatan tertunda',site+' · '+q.length+' catatan antrean');return q.length;}
export function snapshot(s,site='all'){const people=s.people.filter(p=>site==='all'||p.home===site||p.site===site);const inside=people.filter(p=>p.site&&(site==='all'||p.site===site));return {registered:s.people.length,inside:inside.length,transit:inside.filter(p=>!p.area).length,areas:AREAS.map(a=>({name:a,count:inside.filter(p=>p.area===a).length})),categories:['Internal','Mitra kerja','Tamu'].map(name=>({name,count:inside.filter(p=>p.category===name).length}))};}

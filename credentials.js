import {audit,stamp} from './core.js';
export function registerCard(s,id,input,reason,actor){
 const p=s.people.find(x=>x.id===id);if(!p||p.archived||!p.active)throw Error('Aktifkan personel terlebih dahulu untuk mendaftarkan kartu.');
 const value=String(input||'').trim().toUpperCase();reason=String(reason||'').trim();
 if(!/^[A-Z0-9-]{4,64}$/.test(value))throw Error('Nomor kartu harus 4–64 karakter: huruf, angka, atau tanda hubung.');
 if(reason.length<5)throw Error('Isi alasan pendaftaran atau penggantian kartu, minimal 5 karakter.');
 if(s.people.some(x=>[x.card,x.barcode,...(x.revokedCredentials||[]).map(r=>r.value)].some(v=>String(v||'').toUpperCase()===value)))throw Error('Nomor ini sudah digunakan atau pernah dicabut. Gunakan kartu lain.');
 const previous=p.card;p.revokedCredentials??=[];if(previous)p.revokedCredentials.push({value:previous,time:stamp(s),reason,actor});p.card=value;
 audit(s,actor,'Kartu personel didaftarkan',JSON.stringify({id,previous,card:value,reason}));return p;
}

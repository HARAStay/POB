import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,dirname,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const base=resolve(dirname(fileURLToPath(import.meta.url)));
const arg=process.argv.indexOf('--port');const port=Number(arg>=0?process.argv[arg+1]:(process.env.PORT||4173));
if(!Number.isInteger(port)||port<1||port>65535){console.error('Port tidak valid. Contoh: npm start -- --port 4174');process.exit(1);}
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
const server=createServer(async(req,res)=>{try{if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end('Method not allowed');}const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const path=resolve(base,'.'+(name==='/'?'/index.html':name));if(path!==base&&!path.startsWith(base+sep)){res.writeHead(403);return res.end('Forbidden');}if(!(await stat(path)).isFile())throw Error('not file');const data=await readFile(path);res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"});res.end(req.method==='HEAD'?undefined:data);}catch{res.writeHead(404);res.end('Tidak ditemukan');}});
server.on('error',e=>{console.error(e.code==='EADDRINUSE'?`Port ${port} sedang dipakai. Jalankan npm start -- --port ${port+1}`:e.message);process.exit(1);});
server.listen(port,'127.0.0.1',()=>console.log(`\nPOB Donggi Matindok — lokal\nBuka http://127.0.0.1:${port}\nHentikan dengan Ctrl+C. Tidak perlu npm install.\n`));

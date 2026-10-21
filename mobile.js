// Keep mobile records readable without changing their desktop columns or data.
let scheduled=false;
export function labelTables(root=document){
 for(const table of root.querySelectorAll('table')){
  const headers=Array.from(table.querySelectorAll('thead tr:last-child th')).map(th=>(th.innerText||th.textContent).replace(/\s+/g,' ').trim());
  if(!headers.length)continue;
  table.classList.add('mobile-records');table.setAttribute('role','table');
  for(const row of table.querySelectorAll('tbody tr')){
   const cells=Array.from(row.children).filter(td=>td.tagName==='TD');
   const empty=cells.length===1&&cells[0].colSpan>1;
   row.classList.toggle('empty-record',empty);
   if(empty)continue;
   for(const [i,cell]of cells.entries()){cell.dataset.label=headers[i]||'Keterangan';if(!cell.querySelector(':scope > .mobile-cell-value')){const value=document.createElement('div');value.className='mobile-cell-value';while(cell.firstChild)value.appendChild(cell.firstChild);cell.appendChild(value);}}
  }
 }
}
const observer=new MutationObserver(()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;labelTables();});});
observer.observe(document.body,{childList:true,subtree:true});labelTables();

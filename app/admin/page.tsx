'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function Admin(){
  const supabase = supabaseBrowser();
  const [rows,setRows] = useState<any[]>([]);
  const [q,setQ] = useState('');

  useEffect(()=>{ (async()=>{
    const { data } = await supabase.from('shipments').select('*').order('created_at', { ascending:false });
    setRows(data||[]);
  })() },[]);

  const filtered = rows.filter(r=> !q || `${r.item_desc} ${r.dest} ${r.awb||''}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{maxWidth:1100, margin:'0 auto', padding:20}}>
      <h1>Orders CRM</h1>
      <input placeholder="Search" value={q} onChange={e=>setQ(e.target.value)} style={{width:'100%', padding:10, border:'1px solid var(--line)', borderRadius:8}} />
      <table style={{width:'100%', marginTop:12, borderCollapse:'collapse'}}>
        <thead>
          <tr>
            <th align="left">Created</th>
            <th align="left">User</th>
            <th align="left">Dir/Svc/Dest</th>
            <th align="left">Item</th>
            <th align="right">Total (AED)</th>
            <th align="left">Approval</th>
            <th align="left">Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(r=> (
            <tr key={r.id} style={{borderTop:'1px solid var(--line)'}}>
              <td>{new Date(r.created_at).toLocaleString()}</td>
              <td>{r.user_id.slice(0,6)}…</td>
              <td>{r.direction}/{r.service}/{r.dest}</td>
              <td>{r.item_category}: {r.item_desc}</td>
              <td align="right">{Number(r.amount_total).toFixed(2)}</td>
              <td>{r.approval}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
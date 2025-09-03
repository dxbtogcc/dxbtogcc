'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function Dashboard(){
  const supabase = supabaseBrowser();
  const [rows,setRows] = useState<any[]>([]);

  useEffect(()=>{ (async()=>{
    const { data } = await supabase.from('shipments').select('*').order('created_at', { ascending:false });
    setRows(data||[]);
  })() },[]);

  const track = (awb?:string)=>{ if(!awb) return; window.open(`https://www.smsaexpress.com/trackingdetails?trackNo=${encodeURIComponent(awb)}`,'_blank') };

  return (
    <div className="container" style={{maxWidth:1000}}>
      <h1>My Shipments</h1>
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead>
          <tr><th align="left">Date</th><th>AWB</th><th>Dir</th><th>Dest</th><th align="right">Total AED</th><th>Status</th><th>Track</th></tr>
        </thead>
        <tbody>
          {rows.map(r=> (
            <tr key={r.id} style={{borderTop:'1px solid var(--line)'}}>
              <td>{new Date(r.created_at).toLocaleDateString()}</td>
              <td>{r.awb||'—'}</td>
              <td>{r.direction}</td>
              <td>{r.dest}</td>
              <td align="right">{Number(r.amount_total).toFixed(2)}</td>
              <td>{r.status}</td>
              <td><button onClick={()=>track(r.awb)} disabled={!r.awb}>Track</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

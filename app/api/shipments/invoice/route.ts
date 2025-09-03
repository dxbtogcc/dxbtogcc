import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(req: NextRequest){
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if(!user) return NextResponse.json({error:'unauthorized'}, { status: 401 })

  const { shipment_id, path } = await req.json()
  if(!shipment_id || !path) return NextResponse.json({error:'missing params'}, { status: 400 })

  const { error } = await supabase.from('shipments').update({ invoice_url: path }).eq('id', shipment_id)
  if(error) return NextResponse.json({error:error.message}, { status: 400 })
  return NextResponse.json({ ok: true })
}
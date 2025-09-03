import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(req: NextRequest){
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if(!user) return NextResponse.json({error:'unauthorized'},{status:401})

  const { shipment_id, manual_link } = await req.json()
  const { data: s, error } = await supabase.from('shipments').select('*').eq('id', shipment_id).single()
  if(error || !s || s.user_id !== user.id) return NextResponse.json({error:'not found'},{status:404})

  if(manual_link){
    await supabase.from('payments').insert({ shipment_id, provider:'nomod', amount: s.amount_total, status:'pending', link_url: manual_link })
    return NextResponse.json({ link: manual_link })
  }

  // No API access yet: return placeholder
  await supabase.from('payments').insert({ shipment_id, provider:'nomod', amount: s.amount_total, status:'pending' })
  return NextResponse.json({ link: null })
}
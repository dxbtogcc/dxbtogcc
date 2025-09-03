import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { quote } from '@/lib/quote'

export async function POST(req: NextRequest){
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if(!user) return NextResponse.json({error:'unauthorized'}, { status: 401 })

  const body = await req.json()
  const desc = (body.item_desc||'').toLowerCase()
  const bad = ['food','snack','chocolate','drink','meat','perishable','grocery','spice','tea','coffee']
  if(body.item_cat==='Food' || bad.some((w:string)=>desc.includes(w))){
    return NextResponse.json({error:'Food/perishables not allowed'}, { status: 400 })
  }

  const q = quote({
    direction: body.direction,
    service: body.service,
    dest: body.dest,
    pickupMode: body.pickup_mode,
    kg: Number(body.kg), len: Number(body.len), wid: Number(body.wid), hei: Number(body.hei)
  })

  const { data, error } = await supabase.from('shipments').insert({
    user_id: user.id,
    direction: body.direction,
    service: body.service,
    dest: body.dest,
    pickup_mode: body.pickup_mode,
    pickup_address: body.pickup_address,
    weight_kg: body.kg,
    length_cm: body.len, width_cm: body.wid, height_cm: body.hei,
    chargeable_kg: q.chg,
    item_category: body.item_cat,
    item_desc: body.item_desc,
    amount_base: q.b, amount_fuel: q.fuel, amount_gpa: q.gpa, amount_pickup: q.pickup,
    amount_margin: q.margin, amount_vat: q.vat, amount_total: q.total
  }).select('*').single()

  if(error) return NextResponse.json({error:error.message}, { status: 400 })
  return NextResponse.json({ shipment: data })
}
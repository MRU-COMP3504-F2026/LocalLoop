import {NextResponse} from 'next/server'
import { createClient } from '@/supabase/server';

export async function GET(){
    const supabase = await createClient();
    const {data, error} = await supabase
    .from("services")
    .select("*")
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    } 

        return NextResponse.json({ data })

}

export async function POST(request: Request){
    
    try{
       const body = await request.json()
       const supabase = await createClient()

        const {data, error} = await supabase
        .from("services")
        .insert([{name: body.name, description: body.description, price: body.price, quantity: body.quantity, image_url: body.image_url, type: body.type, details: body.details}])
        .select()
        .single();

           if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

            return NextResponse.json({ data }, { status: 201 });
        } catch (err) {
            return NextResponse.json(
        { error: 'Invalid request payload or server error' },
        { status: 500 });
    }
 } 

 export async function PUT (request: Request, {params}:{params: Promise<{service_id: Int8Array}>}){
    try{
        const {service_id} = await params
        const body = await request.json()
        const supabase = await createClient()

        const { data, error } = await supabase
        .from("services")
        .update([{name: body.name, description: body.description, price: body.price, quantity: body.quantity, image_url: body.image_url, type: body.type, details: body.details}])
        .eq("service_id", service_id)
        .select()
        .single();
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

    }catch(err){
        return NextResponse.json({ error: 'Invalid request body or server error' }, { status: 500 })
    }
 }

 export async function Delete(request: Request, {params}: {params: Promise<{service_id:Int8Array}>}) {
        try{
            const {service_id} = await params
            const supabase = await createClient();

            const {error} = await supabase
             .from("services")
             .delete()
             .eq("service_id", service_id);

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }

        }catch{
            return NextResponse.json({ error: 'Internal Server Error' },{ status: 500 });
        }
 }
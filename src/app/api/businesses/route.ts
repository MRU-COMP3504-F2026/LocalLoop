import {NextResponse} from 'next/server'
import { createClient } from '@/supabase/server';

export async function GET(){
    const supabase = await createClient();
    const {data, error} = await supabase
    .from("Businesses")
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
        .from("Businesses")
        .insert([{owner_id: body.owner_id, name: body.name, description: body.description, category: body.category, email: body.email, phone_number: body.phone_number, address: body.address, location: body.location}])
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

 export async function PUT (request: Request, {params}:{params: Promise<{business_id: Int8Array}>}){
    try{
        const {business_id} = await params
        const body = await request.json()
        const supabase = await createClient()

        const { data, error } = await supabase
        .from("Businesses")
        .update([{owner_id: body.owner_id, name: body.name, description: body.description, category: body.category, email: body.email, phone_number: body.phone_number, address: body.address, location: body.location}])
        .eq("business_id", business_id)
        .select()
        .single();
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

    }catch(err){
        return NextResponse.json({ error: 'Invalid request body or server error' }, { status: 500 })
    }
 }

 export async function Delete(request: Request, {params}: {params: Promise<{business_id:Int8Array}>}) {
        try{
            const {business_id} = await params
            const supabase = await createClient();

            const {error} = await supabase
             .from("Businesses")
             .delete()
             .eq("business_id", business_id);

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }

        }catch{
            return NextResponse.json({ error: 'Internal Server Error' },{ status: 500 });
        }
 }

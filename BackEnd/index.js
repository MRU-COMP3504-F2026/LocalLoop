const express = require('express'); 
const supa = require('@supabase/supabase-js'); 
const app = express(); 


const supaUrl = 'https://qtfqquxngzgxzngpnbbj.supabase.co'; 
const supaAnonKey = 'sb_publishable_Vw9F8xPurjVTy3pnVa_4zQ_YXVkrBe4'; 

const supabase = supa.createClient(supaUrl, supaAnonKey); 

app.get('/', async(req, res)=>{
    const {data, error} = await supabase
        .from('User')
        .select()
    res.send(data); 
});

app.listen(3232, () => { 
    console.log('listening on port 3232');  
}); 
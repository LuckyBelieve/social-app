import { supabase } from "../lib/superbase";

export const userService = async()=>{
    try {
        const {} = supabase.from("users").select();
    } catch (error) {
        console.log("got an error: ",error);
        return{
            
        }
        
    }
}
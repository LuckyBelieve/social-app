import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { supabase } from "../lib/superbase";


const _layout = ()=>{
    return(
        <AuthProvider>
            <MainLayout />
        </AuthProvider>
    )
}

const MainLayout = () => {
    const { setAuth } = useAuth();
    const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if(session){
        setAuth(session.user);
        router.replace("/home");
      }else{
        setAuth(null);
        router.replace("/Welcome");
      }
    })
  }, [])
    return <Stack screenOptions={{ headerShown: false }}/>
  };
export default _layout;

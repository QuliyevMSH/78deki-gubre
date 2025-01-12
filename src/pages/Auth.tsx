import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { AuthError, AuthApiError } from '@supabase/supabase-js';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/auth';

const getErrorMessage = (error: AuthError) => {
  if (error instanceof AuthApiError) {
    switch (error.code) {
      case 'user_already_exists':
        return 'Bu email artıq qeydiyyatdan keçib. Zəhmət olmasa daxil olun və ya başqa email istifadə edin.';
      case 'email_address_invalid':
        return 'Düzgün email ünvanı daxil edin.';
      case 'invalid_credentials':
        return 'Yanlış email və ya şifrə. Məlumatlarınızı yoxlayın və yenidən cəhd edin.';
      case 'email_not_confirmed':
        return 'Zəhmət olmasa giriş etməzdən əvvəl email ünvanınızı təsdiqləyin.';
      case 'user_not_found':
        return 'Bu məlumatlarla istifadəçi tapılmadı.';
      case 'invalid_grant':
        return 'Yanlış giriş məlumatları.';
      default:
        return error.message;
    }
  }
  return error.message;
};

export default function Auth() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    // Redirect to home if user is already logged in
    if (user) {
      navigate('/');
    }

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          navigate('/');
        }
        if (event === 'USER_UPDATED') {
          const { error } = await supabase.auth.getSession();
          if (error) {
            setErrorMessage(getErrorMessage(error));
          }
        }
        if (event === 'SIGNED_OUT') {
          setErrorMessage(""); // Clear errors on sign out
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, user]);

  return (
    <div className="min-h-screen bg-emerald-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Giriş / Qeydiyyat
        </h1>

        {errorMessage && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#059669',
                  brandAccent: '#047857',
                }
              }
            }
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Şifrə',
                button_label: 'Giriş',
                loading_button_label: 'Giriş edilir...',
              },
              sign_up: {
                email_label: 'Email',
                password_label: 'Şifrə',
                button_label: 'Qeydiyyat',
                loading_button_label: 'Qeydiyyat edilir...',
              },
            }
          }}
        />
      </div>
    </div>
  );
}
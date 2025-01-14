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
    if (user) {
      navigate('/');
    }

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
          setErrorMessage("");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, user]);

  return (
    <div className="min-h-screen bg-[#F2FCE2] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <img src="/lovable-uploads/0e1e6550-b588-485a-bf15-83042085c242.png" alt="Logo" className="w-8 h-8" />
          <h1 className="text-2xl font-semibold text-center">
            Sizi aramızda görməyə sevinirik
          </h1>
        </div>

        {errorMessage && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <SupabaseAuth
          supabaseClient={supabase}
          providers={[]}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#047857',
                  brandAccent: '#065f46',
                  brandButtonText: 'white',
                  defaultButtonBackground: 'black',
                  defaultButtonBackgroundHover: '#1f2937',
                  inputBackground: 'white',
                  inputBorder: '#e5e7eb',
                  inputBorderHover: '#d1d5db',
                  inputBorderFocus: '#047857',
                },
                space: {
                  inputPadding: '12px',
                  buttonPadding: '12px',
                },
              }
            },
            style: {
              button: {
                width: '100%',
                marginTop: '8px',
              },
              input: {
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
              },
              message: {
                color: '#ef4444',
              },
              anchor: {
                color: '#047857',
                textDecoration: 'none',
              },
            },
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Şifrə',
                button_label: 'Giriş',
                loading_button_label: 'Giriş edilir...',
                link_text: 'Artıq hesabınız var? Daxil olun',
              },
              sign_up: {
                email_label: 'Email',
                password_label: 'Şifrə',
                button_label: 'Qeydiyyat',
                loading_button_label: 'Qeydiyyat edilir...',
                link_text: 'Hesabınız yoxdur? Qeydiyyatdan keçin',
                confirmation_text: 'Təsdiq emaili göndərildi',
              },
            }
          }}
        />
      </div>
    </div>
  );
}
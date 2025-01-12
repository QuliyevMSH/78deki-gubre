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
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-black/20 backdrop-blur-lg rounded-2xl p-8">
        {/* Left side - Image */}
        <div className="hidden md:block relative overflow-hidden rounded-xl">
          <img 
            src="/lovable-uploads/f310e059-aa26-411e-aad7-c0c997e8ba2a.png" 
            alt="Login background" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right side - Auth form */}
        <div className="flex flex-col justify-center">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8">
            <h1 className="text-3xl font-semibold text-white mb-6 text-center">
              Hesab yarat və ya Daxil ol
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
                      brandButtonText: 'white',
                      defaultButtonBackground: 'white',
                      defaultButtonBackgroundHover: '#f9fafb',
                      inputBackground: 'white',
                      inputBorder: 'transparent',
                      inputBorderHover: '#059669',
                      inputBorderFocus: '#059669',
                    },
                    radii: {
                      borderRadiusButton: '0.75rem',
                      buttonBorderRadius: '0.75rem',
                      inputBorderRadius: '0.75rem',
                    },
                  },
                },
                className: {
                  container: 'space-y-4',
                  button: 'w-full px-4 py-3 rounded-xl font-medium transition-colors',
                  input: 'w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500',
                  label: 'text-white',
                },
              }}
              localization={{
                variables: {
                  sign_in: {
                    email_label: 'Email',
                    password_label: 'Şifrə',
                    button_label: 'Daxil ol',
                    loading_button_label: 'Daxil olunur...',
                    social_provider_text: 'İlə daxil ol',
                    link_text: 'Hesabınız var? Daxil olun',
                  },
                  sign_up: {
                    email_label: 'Email',
                    password_label: 'Şifrə',
                    button_label: 'Qeydiyyat',
                    loading_button_label: 'Qeydiyyat edilir...',
                    social_provider_text: 'İlə qeydiyyatdan keç',
                    link_text: 'Hesabınız yoxdur? Qeydiyyatdan keçin',
                    confirmation_text: 'Email ünvanınıza təsdiq linki göndərildi',
                  },
                },
              }}
              providers={[]}
              view="sign_up"
              additionalData={{
                first_name: {
                  label: 'Ad',
                  placeholder: 'Adınızı daxil edin',
                  type: 'text',
                  required: true,
                },
                last_name: {
                  label: 'Soyad',
                  placeholder: 'Soyadınızı daxil edin',
                  type: 'text',
                  required: true,
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

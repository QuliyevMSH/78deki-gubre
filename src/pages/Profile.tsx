import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tables } from '@/integrations/supabase/types';

type Profile = Pick<Tables<'profiles'>, 'first_name' | 'last_name' | 'avatar_url'>;

export default function Profile() {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    first_name: '',
    last_name: '',
    avatar_url: null,
  });

  useEffect(() => {
    let mounted = true;

    const initializeSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!session) {
          navigate('/auth');
          return;
        }

        if (mounted) {
          await getProfile(session.user.id);
        }
      } catch (error) {
        console.error('Session error:', error);
        toast({
          variant: "destructive",
          title: "Xəta baş verdi",
          description: "Sessiya yoxlanılmadı",
        });
        navigate('/auth');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      } else if (session && mounted) {
        await getProfile(session.user.id);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  async function getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setProfile({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          avatar_url: data.avatar_url,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        variant: "destructive",
        title: "Xəta baş verdi",
        description: "Profil məlumatları yüklənmədi",
      });
    }
  }

  async function updateProfile() {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        avatar_url: profile.avatar_url,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      
      toast({
        title: "Uğurlu!",
        description: "Profil məlumatları yeniləndi",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Xəta baş verdi",
        description: "Profil məlumatları yenilənmədi",
      });
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Şəkil seçilmədi');
      }

      if (!user) {
        navigate('/auth');
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      setProfile({
        ...profile,
        avatar_url: data.publicUrl,
      });
      
      toast({
        title: "Uğurlu!",
        description: "Profil şəkli yükləndi",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        variant: "destructive",
        title: "Xəta baş verdi",
        description: "Profil şəkli yüklənmədi",
      });
    } finally {
      setUploading(false);
    }
  }

  const handleDeleteAccount = async () => {
    try {
      if (!user) return;

      // Call our Edge Function using the Supabase client
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { user_id: user.id },
      });

      if (error) throw error;

      // Sign out immediately after successful deletion
      await signOut();
      
      toast({
        title: "Hesab silindi",
        description: "Hesabınız uğurla silindi",
      });

      navigate('/auth');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        variant: "destructive",
        title: "Xəta baş verdi",
        description: "Hesabınız silinmədi",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-32 h-32 mb-4">
            <img
              src={profile.avatar_url || '/placeholder.svg'}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
            <label
              htmlFor="avatar"
              className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90"
            >
              <input
                type="file"
                id="avatar"
                className="hidden"
                accept="image/*"
                onChange={uploadAvatar}
                disabled={uploading}
              />
              {uploading ? '...' : '✏️'}
            </label>
          </div>
          <h2 className="text-2xl font-semibold">
            {profile.first_name} {profile.last_name}
          </h2>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Ad</Label>
              <Input
                id="firstName"
                type="text"
                value={profile.first_name}
                onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Soyad</Label>
              <Input
                id="lastName"
                type="text"
                value={profile.last_name}
                onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ''}
              disabled
            />
          </div>

          <Button
            className="w-full"
            onClick={updateProfile}
          >
            Yadda saxla
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full"
              >
                Hesabını sil
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hesabınızı silmək istədiyinizə əminsiniz?</AlertDialogTitle>
                <AlertDialogDescription>
                  Bu əməliyyat geri qaytarıla bilməz. Hesabınız və bütün məlumatlarınız silinəcək.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>İmtina</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount}>
                  Hesabı sil
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

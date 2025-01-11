import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  product_id: number;
  parent_id: number | null;
  user: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}

export default function CommentSection() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          product_id,
          parent_id,
          user:profiles(first_name, last_name, avatar_url)
        `)
        .eq('product_id', id)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        variant: "destructive",
        title: "Xəta baş verdi",
        description: "Rəylər yüklənmədi",
      });
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Rəy yazmaq üçün daxil olmalısınız",
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Rəy boş ola bilməz",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          content: newComment.trim(),
          user_id: user.id,
          product_id: Number(id),
        });

      if (error) throw error;

      setNewComment('');
      toast({
        title: "Uğurlu",
        description: "Rəyiniz əlavə edildi",
      });
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        variant: "destructive",
        title: "Xəta baş verdi",
        description: "Rəy əlavə edilmədi",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">Rəylər</h2>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Rəyinizi yazın..."
          className="mb-4"
          disabled={loading || !user}
        />
        <Button type="submit" disabled={loading || !user}>
          {loading ? 'Göndərilir...' : 'Rəy yaz'}
        </Button>
      </form>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-3">
              <Avatar>
                <AvatarImage src={comment.user.avatar_url || undefined} />
                <AvatarFallback>
                  {comment.user.first_name?.[0]}
                  {comment.user.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {comment.user.first_name} {comment.user.last_name}
                </p>
                <p className="text-sm text-gray-500">
                  {format(new Date(comment.created_at), 'dd.MM.yyyy HH:mm')}
                </p>
              </div>
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
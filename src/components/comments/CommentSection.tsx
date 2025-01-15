import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { ThumbsUp } from 'lucide-react';

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
  } | null;
  likes: number;
  user_has_liked: boolean;
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
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select(`
          *,
          user:profiles(first_name, last_name, avatar_url),
          likes:comment_likes(count),
          user_has_liked:comment_likes!left(user_id)
        `)
        .eq('product_id', parseInt(id || '0'))
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;

      const formattedComments = commentsData?.map(comment => ({
        ...comment,
        likes: comment.likes?.[0]?.count || 0,
        user_has_liked: comment.user_has_liked?.some(like => like.user_id === user?.id) || false
      })) || [];

      setComments(formattedComments);
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

  const ensureProfileExists = async () => {
    if (!user) return false;

    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle(); // Changed from single() to maybeSingle()

    if (!profile) {
      // Create profile if it doesn't exist
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ id: user.id });

      if (insertError) {
        console.error('Error creating profile:', insertError);
        return false;
      }
    }

    return true;
  };

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
      // Ensure profile exists before adding comment
      const profileExists = await ensureProfileExists();
      if (!profileExists) {
        throw new Error("Profile could not be created");
      }

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

  const handleLike = async (commentId: number, isLiked: boolean) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Like etmək üçün daxil olmalısınız",
      });
      return;
    }

    try {
      // Ensure profile exists before adding/removing like
      const profileExists = await ensureProfileExists();
      if (!profileExists) {
        throw new Error("Profile could not be created");
      }

      if (isLiked) {
        // Remove like
        const { error } = await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Add like
        const { error } = await supabase
          .from('comment_likes')
          .insert({
            comment_id: commentId,
            user_id: user.id,
          });

        if (error) {
          if (error.code === '23505') {
            toast({
              variant: "destructive",
              title: "Xəta",
              description: "Bu rəyi artıq like etmisiniz",
            });
            return;
          }
          throw error;
        }
      }

      fetchComments();
    } catch (error) {
      console.error('Error handling like:', error);
      toast({
        variant: "destructive",
        title: "Xəta baş verdi",
        description: "Əməliyyat uğursuz oldu",
      });
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
                <AvatarImage src={comment.user?.avatar_url || undefined} />
                <AvatarFallback>
                  {comment.user?.first_name?.[0] || ''}
                  {comment.user?.last_name?.[0] || ''}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {comment.user?.first_name && comment.user?.last_name 
                    ? `${comment.user.first_name} ${comment.user.last_name}`
                    : 'Naməlum istifadəçi'}
                </p>
                <p className="text-sm text-gray-500">
                  {format(new Date(comment.created_at), 'dd.MM.yyyy HH:mm')}
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-3">{comment.content}</p>
            <div className="flex items-center gap-2">
              <Button
                variant={comment.user_has_liked ? "default" : "outline"}
                size="sm"
                className="gap-2"
                onClick={() => handleLike(comment.id, comment.user_has_liked)}
                disabled={!user}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{comment.likes}</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Comment } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { az } from 'date-fns/locale';
import { MessageCircle, Reply } from 'lucide-react';

interface CommentSectionProps {
  productId: number;
  user: User | null;
}

export const CommentSection = ({ productId, user }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const { toast } = useToast();

  const fetchComments = async () => {
    try {
      const { data: commentsData, error: commentsError } = await supabase
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
        .eq('product_id', productId)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;

      // Fetch replies for each comment
      const commentsWithReplies = await Promise.all(
        (commentsData || []).map(async (comment) => {
          const { data: replies, error: repliesError } = await supabase
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
            .eq('parent_id', comment.id)
            .order('created_at', { ascending: true });

          if (repliesError) throw repliesError;

          return {
            ...comment,
            replies: replies || [],
          };
        })
      );

      setComments(commentsWithReplies);
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Rəylər yüklənmədi",
      });
    }
  };

  const handleSubmitComment = async () => {
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

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          product_id: productId,
          user_id: user.id,
          content: newComment,
        });

      if (error) throw error;

      setNewComment('');
      await fetchComments();
      
      toast({
        title: "Uğurlu",
        description: "Rəyiniz əlavə edildi",
      });
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Rəy əlavə edilmədi",
      });
    }
  };

  const handleSubmitReply = async (parentId: number) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Cavab yazmaq üçün daxil olmalısınız",
      });
      return;
    }

    if (!replyContent.trim()) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Cavab boş ola bilməz",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          product_id: productId,
          user_id: user.id,
          content: replyContent,
          parent_id: parentId,
        });

      if (error) throw error;

      setReplyContent('');
      setReplyTo(null);
      await fetchComments();
      
      toast({
        title: "Uğurlu",
        description: "Cavabınız əlavə edildi",
      });
    } catch (error: any) {
      console.error('Error adding reply:', error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Cavab əlavə edilmədi",
      });
    }
  };

  useEffect(() => {
    fetchComments();
  }, [productId]);

  const renderComment = (comment: Comment) => (
    <div key={comment.id} className="space-y-4">
      <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
        <img
          src={comment.user.avatar_url || '/placeholder.svg'}
          alt={`${comment.user.first_name || 'User'}'s avatar`}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">
              {comment.user.first_name} {comment.user.last_name}
            </h4>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(comment.created_at), { 
                addSuffix: true,
                locale: az 
              })}
            </span>
          </div>
          <p className="text-gray-700">{comment.content}</p>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500"
            onClick={() => setReplyTo(comment.id)}
          >
            <Reply className="w-4 h-4 mr-2" />
            Cavabla
          </Button>
        </div>
      </div>

      {replyTo === comment.id && (
        <div className="ml-14 space-y-4">
          <Textarea
            placeholder="Cavabınızı yazın..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={() => handleSubmitReply(comment.id)}>
              Göndər
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setReplyTo(null);
                setReplyContent('');
              }}
            >
              Ləğv et
            </Button>
          </div>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-14 space-y-4">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
              <img
                src={reply.user.avatar_url || '/placeholder.svg'}
                alt={`${reply.user.first_name || 'User'}'s avatar`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">
                    {reply.user.first_name} {reply.user.last_name}
                  </h4>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(reply.created_at), { 
                      addSuffix: true,
                      locale: az 
                    })}
                  </span>
                </div>
                <p className="text-gray-700">{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-6 h-6" />
        <h3 className="text-xl font-semibold">Rəylər</h3>
      </div>

      <div className="space-y-4">
        <Textarea
          placeholder="Rəyinizi yazın..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button onClick={handleSubmitComment}>
          Rəy əlavə et
        </Button>
      </div>

      <div className="space-y-6">
        {comments.map(renderComment)}
      </div>
    </div>
  );
};
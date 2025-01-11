import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  product_id: number;
  user: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  product: {
    name: string;
  } | null;
}

export const CommentsManagement = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const { toast } = useToast();

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          user:profiles(first_name, last_name),
          product:products(name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Rəylər yüklənmədi",
      });
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleSave = async () => {
    if (!editingId) return;

    try {
      const { error } = await supabase
        .from("comments")
        .update({ content: editContent })
        .eq("id", editingId);

      if (error) throw error;

      toast({
        title: "Uğurlu",
        description: "Rəy yeniləndi",
      });

      setEditingId(null);
      fetchComments();
    } catch (error) {
      console.error("Error updating comment:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Rəy yenilənmədi",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu rəyi silmək istədiyinizdən əminsiniz?")) return;

    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Uğurlu",
        description: "Rəy silindi",
      });

      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Rəy silinmədi",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Rəylər</h2>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>İstifadəçi</TableHead>
            <TableHead>Məhsul</TableHead>
            <TableHead>Rəy</TableHead>
            <TableHead>Tarix</TableHead>
            <TableHead>Əməliyyatlar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comments.map((comment) => (
            <TableRow key={comment.id}>
              <TableCell>
                {comment.user?.first_name || comment.user?.last_name ? 
                  `${comment.user.first_name || ''} ${comment.user.last_name || ''}`.trim() : 
                  'Naməlum istifadəçi'
                }
              </TableCell>
              <TableCell>{comment.product?.name || 'Naməlum məhsul'}</TableCell>
              <TableCell className="max-w-md">
                {editingId === comment.id ? (
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[100px]"
                  />
                ) : (
                  comment.content
                )}
              </TableCell>
              <TableCell>
                {format(new Date(comment.created_at), "dd.MM.yyyy HH:mm")}
              </TableCell>
              <TableCell>
                {editingId === comment.id ? (
                  <div className="space-x-2">
                    <Button onClick={handleSave}>Yadda saxla</Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingId(null)}
                    >
                      Ləğv et
                    </Button>
                  </div>
                ) : (
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(comment)}
                    >
                      Düzəliş et
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(comment.id)}
                    >
                      Sil
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
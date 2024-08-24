"use client";

import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { CommentRequest } from "@/lib/validators/comment";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/Button";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";

interface CreateCommentProps {
  postId: string;
  replyToId?: string;
}

const CreateComment = ({ postId, replyToId }: CreateCommentProps) => {
  const [input, setInput] = useState("");
  const { loginToast } = useCustomToast();
  const router = useRouter();
  const [showBox, setShowBox] = useState(false);

  const { mutate: comment, isPending } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId,
      };

      const { data } = await axios.patch(
        `/api/subreddit/post/comment`,
        payload
      );

      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status == 401) {
          return loginToast();
        }
      }

      return toast({
        title: "There was a problem",
        description: "Something went wrong, Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
      setInput("");
      setShowBox(false);
    },
  });

  return (
    <div>
      {!showBox ? (
        <Button className="w-full" onClick={() => setShowBox(true)}>
          <Plus />
          Add Comment
        </Button>
      ) : (
        <div className="grid w-full gap-1.5">
          <Label htmlFor="comment">Your comment</Label>
          <div className="mt-2">
            <Textarea
              id="comment"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What are your thoughts?"
            />

            <div className="mt-2 flex justify-end gap-3">
              <Button variant="subtle" onClick={() => setShowBox(false)}>
                Cancel
              </Button>
              <Button
                isLoading={isPending}
                disabled={input.length === 0}
                onClick={() => comment({ postId, replyToId, text: input })}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateComment;

"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

const PostDeleteConfirmation = ({
  postId,
  open,
  setOpen,
}: {
  postId: string;
  open: boolean;
  setOpen: any;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: deletePost, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(
        `/api/subreddit/post/delete/${postId}`
      );

      return data;
    },
    onSuccess: () => {
      setOpen(false);
      router.push("/");
      queryClient.invalidateQueries({ queryKey: ["infinite-query"] });
      //   router.refresh();
      return toast({
        title: "Deleted Successfully",
        description: "Post has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "There was a problem",
        description:
          "Something went wrong while deleting, please try again later.",
        variant: "destructive",
      });
    },
  });

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
          <AlertDialogDescription className="p-regular-16 text-grey-600">
            This will permanently delete this trainer
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={() => deletePost()}
            className="bg-red-500"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PostDeleteConfirmation;

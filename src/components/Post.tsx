"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { formatTimeToNow } from "@/lib/utils";
import { Post as PostType, User, Vote } from "@prisma/client";
import { Ellipsis, MessageSquare, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import EditorOutput from "./EditorOutput";
import PostVoteClient from "./post-vote/PostVoteClient";
import PostDeleteConfirmation from "./PostDeleteConfirmation";
import { Button } from "./ui/Button";
import { useSession } from "next-auth/react";

type PartialVote = Pick<Vote, "type">;

type PostProps = {
  subredditName?: string;
  post: PostType & { author: User; votes: Vote[] };
  commentAmt: number;
  votesAmt: number;
  currentVote?: PartialVote;
};

const Post = ({
  commentAmt,
  subredditName,
  post,
  votesAmt,
  currentVote,
}: PostProps) => {
  const pRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="relative rounded-md bg-white shadow">
      {session?.user.id === post.authorId && (
        <>
          {" "}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="absolute top-2 right-2">
              <Ellipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setOpen(true)}>
                <Button
                  variant="destructive"
                  className="text-md flex items-center gap-2 bg-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <PostDeleteConfirmation
            postId={post.id}
            open={open}
            setOpen={setOpen}
          />
        </>
      )}
      <div className="px-6 py-4 flex flex-col sm:flex-row justify-between">
        <div className="w-full sm:w-0 -order-10 sm:order-1 flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500">
            {subredditName ? (
              <>
                <a
                  href={`/r/${subredditName}`}
                  className="underline text-zinc-900 text-sm underline-offset-2"
                >
                  r/{subredditName}
                </a>

                <span className="px-1">.</span>
              </>
            ) : null}
            <span>Post by u/{post.author.username}</span>{" "}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>

          <a href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
              {post.title}
            </h1>
          </a>

          <div
            className="relative text-sm max-h-40 w-full overflow-clip"
            ref={pRef}
          >
            <EditorOutput content={post.content} />
            {pRef.current?.clientHeight === 160 ? (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent" />
            ) : null}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 z-20 text-sm p-4 sm:px-6 flex gap-4">
        <PostVoteClient
          postId={post.id}
          initialVotesAmt={votesAmt}
          initialVote={currentVote?.type}
        />
        <a
          href={`/r/${subredditName}/post/${post.id}`}
          className="w-fit flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          {commentAmt} comments
        </a>
      </div>
    </div>
  );
};

export default Post;

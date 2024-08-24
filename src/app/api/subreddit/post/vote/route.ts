import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { PostVoteValidator } from "@/lib/validators/vote";
import { VoteType } from "@prisma/client";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { postId, voteType } = PostVoteValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthrized", { status: 401 });
    }

    const existingVote = await db.vote.findFirst({
      where: {
        postId,
        userId: session.user.id,
      },
    });

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
        comments: true,
      },
    });

    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.vote.delete({
          where: {
            id: existingVote.id,
          },
        });

        return new Response("OK");
      }

      await db.vote.update({
        where: {
          id: existingVote.id,
        },
        data: {
          type: voteType,
        },
      });

      const votesAmt = post.votes.reduce((acc, vote) => {
        if (vote.type === "UP") return acc + 1;
        if (vote.type === "DOWN") return acc - 1;
        return acc;
      }, 0);

      if (votesAmt >= 1) {
        const cachedPayload: any = {
          authorUseranme: post.author.username ?? "",
          content: JSON.stringify(post.content),
          title: post.title,
          currentVote: VoteType || null,
          createdAt: post.createdAt,
          id: post.id,
          commentsAmt: post.comments.length,
        };

        await redis.hset(`post:${postId}`, cachedPayload);
      }

      return new Response("OK");
    }

    await db.vote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        postId,
      },
    });

    const votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;
      return acc;
    }, 0);

    if (votesAmt >= 1) {
      const cachedPayload: any = {
        authorUseraname: post.author.username ?? "",
        content: JSON.stringify(post.content),
        title: post.title,
        currentVote: VoteType || null,
        createdAt: post.createdAt,
        id: post.id,
        commentsAmt: post.comments.length,
      };

      await redis.hset(`post:${postId}`, cachedPayload);
    }

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response("Could not register your vote", { status: 500 });
  }
}

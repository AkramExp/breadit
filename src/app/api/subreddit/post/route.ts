import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized Request", { status: 401 });
    }

    const body = await req.json();
    console.log(body);

    const { title, subredditId, content } = PostValidator.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return new Response("Subscribe to post", { status: 400 });
    }

    await db.post.create({
      data: {
        title,
        content,
        subredditId,
        authorId: session.user.id,
      },
    });

    return new Response("OK", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response("Could not post at this time, please try again later", {
      status: 500,
    });
  }
}

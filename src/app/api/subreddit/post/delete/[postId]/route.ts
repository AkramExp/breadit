import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;

    await db.post.delete({
      where: {
        id: postId,
      },
    });

    await db.comment.deleteMany({
      where: {
        postId,
      },
    });

    await db.vote.deleteMany({
      where: {
        postId,
      },
    });

    return new Response("OK");
  } catch (error) {
    return new Response("Could not post at this time, please try again later", {
      status: 500,
    });
  }
}

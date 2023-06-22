import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";

export const tweetRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input: { content }, ctx }) => {
      return await ctx.prisma.tweet.create({
        data: { content, userId: ctx.session.user.id },
      });
    }),

  infiniteFeed: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z
          .object({
            id: z.string(),
            createdAt: z.date(),
          })
          .optional(),
      })
    )
    .query(async ({ input: { limit = 10, cursor }, ctx }) => {
      const currUserId = ctx.session?.user.id;
      const tweets = await ctx.prisma.tweet.findMany({
        take: limit + 1,
        cursor:
          cursor === undefined ? undefined : ({ id_createdAt: cursor } as any),
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: {
          id: true,
          content: true,
          createdAt: true,
          _count: { select: { likes: true } },
          likes:
            currUserId === undefined
              ? false
              : { where: { userId: currUserId } },
          user: {
            select: { name: true, id: true, image: true },
          },
        },
      });
      let nextCursor: typeof cursor | undefined;
      if (tweets.length > limit) {
        const nextTweet = tweets.pop();
        if (nextTweet !== undefined) {
          nextCursor = { id: nextTweet.id, createdAt: nextTweet.createdAt };
        }
      }
      const outData = tweets.map((tweet) => ({
        id: tweet.id,
        content: tweet.content,
        createdAt: tweet.createdAt,
        likeCount: tweet._count.likes,
        likedByMe: tweet.likes?.length > 0,
        user: {
          id: tweet.user.id,
          image: tweet.user.image ?? undefined,
          name: tweet.user.name ?? undefined,
        },
      }));
      return { tweets: outData, nextCursor };
    }),

  toggleLike: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const data = { userId: ctx.session.user.id, tweetId: id };
      const like = await ctx.prisma.like.findUnique({
        where: { userId_tweetId: data },
      });
      if (like === null) {
        await ctx.prisma.like.create({ data });
        return { addedLike: true };
      } else {
        await ctx.prisma.like.delete({ where: { userId_tweetId: data } });
        return { addedLike: false };
      }
    }),
});

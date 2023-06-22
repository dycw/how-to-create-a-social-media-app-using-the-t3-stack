import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const profileRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const currentUserId = ctx.session?.user.id;
      const profile = await ctx.prisma.user.findUnique({
        where: { id },
        select: {
          name: true,
          image: true,
          _count: { select: { followers: true, follows: true, tweets: true } },
          followers:
            currentUserId === undefined
              ? false
              : { where: { id: currentUserId } },
        },
      });
      return profile === null
        ? null
        : {
            name: profile.name,
            image: profile.image,
            followersCount: profile._count.followers,
            followsCount: profile._count.follows,
            tweetsCount: profile._count.tweets,
            isFollowing: profile.followers.length >= 1,
          };
    }),
});

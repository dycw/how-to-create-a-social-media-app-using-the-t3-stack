import IconHoverEffect from "@/components/IconHoverEffect";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProfileImage from "@/components/ProfileImage";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { VscHeart, VscHeartFilled } from "react-icons/vsc";
import InfiniteScroll from "react-infinite-scroll-component";

type Tweet = {
  id: string;
  content: string;
  createdAt: Date;
  likedByMe: boolean;
  likeCount: number;
  user: {
    id: string;
    image?: string | undefined;
    name?: string | undefined;
  };
};

export default function InfiniteTweetList({
  tweets,
  isLoading,
  isError,
  hasMore,
  fetchNewTweets,
}: {
  tweets?: Tweet[] | undefined;
  isError: boolean;
  isLoading: boolean;
  hasMore?: boolean | undefined;
  fetchNewTweets: () => Promise<unknown>;
}) {
  if (isLoading) {
    return (
      <h1>
        <LoadingSpinner />
      </h1>
    );
  }
  if (isError) {
    return <h1>Error...</h1>;
  }
  if (tweets === undefined || tweets.length === 0) {
    return (
      <h2 className="my-4 text-center text-2xl text-gray-500">No tweets</h2>
    );
  }
  return (
    <ul>
      <InfiniteScroll
        dataLength={tweets.length}
        next={fetchNewTweets}
        hasMore={hasMore ?? false}
        loader={<LoadingSpinner />}
      >
        {tweets.map((tweet) => (
          <TweetCard key={tweet.id} {...tweet} />
        ))}
      </InfiniteScroll>
    </ul>
  );
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
});

function TweetCard({
  id,
  content,
  createdAt,
  likedByMe,
  likeCount,
  user,
}: Tweet) {
  const trpcUtils = api.useContext();
  const toggleLike = api.tweet.toggleLike.useMutation({
    onSuccess: ({ addedLike }) => {
      const updateData: Parameters<
        typeof trpcUtils.tweet.infiniteFeed.setInfiniteData
      >[1] = (oldData) => {
        if (oldData === undefined) {
          return;
        }
        const countModifier = addedLike ? 1 : -1;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            tweets: page.tweets.map((tweet) =>
              tweet.id === id
                ? {
                    ...tweet,
                    likeCount: tweet.likeCount + countModifier,
                    likedByMe: addedLike,
                  }
                : tweet
            ),
          })),
        };
      };
      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, updateData);
      trpcUtils.tweet.infiniteFeed.setInfiniteData(
        { onlyFollowing: true },
        updateData
      );
      trpcUtils.tweet.infiniteProfileFeed.setInfiniteData(
        { userId: user.id },
        updateData
      );
    },
  });

  const handleToggleLike = () => toggleLike.mutate({ id });

  return (
    <li className="flex gap-4 border-b p-4">
      <Link href={`/profiles/${user.id}`}>
        <ProfileImage src={user.image} />
      </Link>
      <div className="flex flex-grow flex-col">
        <div className="flex gap-1">
          <Link
            className="font-bold outline-none hover:underline focus-visible:underline"
            href={`profiles/${user.id}`}
          >
            {user.name}
          </Link>
          <span className="text-gray-500">-</span>
          <span className="text-gray-500">
            {dateTimeFormatter.format(createdAt)}
          </span>
        </div>
        <p className="whitespace-pre-wrap">{content}</p>
        <HeartButton
          onClick={handleToggleLike}
          isLoading={toggleLike.isLoading}
          likedByMe={likedByMe}
          likeCount={likeCount}
        />
      </div>
    </li>
  );
}

function HeartButton({
  isLoading,
  likeCount,
  likedByMe,
  onClick,
}: {
  isLoading: boolean;
  likeCount: number;
  likedByMe: boolean;
  onClick: () => void;
}) {
  const session = useSession();
  const HeartIcon = likedByMe ? VscHeartFilled : VscHeart;
  if (session.status !== "authenticated") {
    return (
      <div className="my-1 flex items-center gap-3 self-start text-gray-500">
        <HeartIcon />
        <span>{likeCount}</span>
      </div>
    );
  }
  return (
    <button
      className={`group -ml-2 flex items-center gap-1 self-start transition-colors duration-200 ${
        likedByMe
          ? "text-red-500"
          : "text-gray-500 hover:text-red-500 focus-visible:text-red-500"
      } `}
      disabled={isLoading}
      onClick={onClick}
    >
      <IconHoverEffect red>
        <HeartIcon
          className={`transition-colors duration-200 ${
            likedByMe
              ? "fill-red-500"
              : "fill-gray-500 group-hover:fill-red-500 group-focus-visible:fill-red-500 "
          })`}
        />
      </IconHoverEffect>
      <span>{likeCount}</span>
    </button>
  );
}

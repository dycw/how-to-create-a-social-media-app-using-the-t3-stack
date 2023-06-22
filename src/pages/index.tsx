import InfiniteTweetList from "@/components/InfiniteTweetList";
import NewTweetForm from "@/components/NewTweetForm";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useState } from "react";

const TABS = ["Recent", "Following"] as const;

export default function Home() {
  const [selectedTab, setSelectedTab] =
    useState<(typeof TABS)[number]>("Recent");
  const session = useSession();
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white">
        <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
        {session.status === "authenticated" && (
          <div className="flex">
            {TABS.map((tab) => (
              <button
                className={`flex-grow p-2 hover:bg-gray-200 focus-visible:bg-gray-200 ${
                  tab === selectedTab
                    ? "border-b-4 border-b-blue-500 font-bold"
                    : ""
                }`}
                key={tab}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </header>
      <NewTweetForm />
      {selectedTab === "Recent" && <RecentTweets />}
      {selectedTab === "Following" && <FollowingTweets />}
    </>
  );
}

function RecentTweets() {
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
    {},
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );
  return (
    <InfiniteTweetList
      tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
      isLoading={tweets.isLoading}
      isError={tweets.isError}
      hasMore={tweets.hasNextPage}
      fetchNewTweets={tweets.fetchNextPage}
    />
  );
}

function FollowingTweets() {
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
    { onlyFollowing: true },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );
  return (
    <InfiniteTweetList
      tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
      isLoading={tweets.isLoading}
      isError={tweets.isError}
      hasMore={tweets.hasNextPage}
      fetchNewTweets={tweets.fetchNextPage}
    />
  );
}

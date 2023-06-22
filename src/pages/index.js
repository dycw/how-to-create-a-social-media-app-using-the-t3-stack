"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InfiniteTweetList_1 = require("@/components/InfiniteTweetList");
var NewTweetForm_1 = require("@/components/NewTweetForm");
var api_1 = require("@/utils/api");
function Home() {
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white">
        <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
      </header>
      <NewTweetForm_1.default />
      <RecentTweets />
    </>
  );
}
exports.default = Home;
function RecentTweets() {
  var _a, _b;
  var tweets = api_1.api.tweet.infiniteFeed.useInfiniteQuery(
    {},
    {
      getNextPageParam: function (lastPage) {
        return lastPage.nextCursor;
      },
    }
  );
  return (
    <InfiniteTweetList_1.default
      tweets={
        (_a = tweets.data) === null || _a === void 0
          ? void 0
          : _a.pages.flatMap(function (page) {
              return page.tweets;
            })
      }
      isLoading={tweets.isLoading}
      isError={tweets.isError}
      hasMore={(_b = tweets.hasNextPage) !== null && _b !== void 0 ? _b : false}
      fetchNewTweets={tweets.fetchNextPage}
    />
  );
}

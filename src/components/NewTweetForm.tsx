import Button from "@/components/Button";
import ProfileImage from "@/components/ProfileImage";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import {
  FormEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
  if (textArea === undefined) {
    return;
  }
  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
}

function Form({
  id,
  name,
  image,
}: {
  id: string;
  name?: string | undefined;
  image?: string | undefined;
}) {
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const [inputValue, setInputValue] = useState("");
  const trpcUtils = api.useContext();

  useLayoutEffect(() => updateTextAreaSize(textAreaRef.current), [inputValue]);
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  const createTweet = api.tweet.create.useMutation({
    onSuccess: (newTweet) => {
      setInputValue("");
      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, (oldData) => {
        if (oldData === undefined || oldData.pages[0] === undefined) {
          return;
        }
        const newCacheTweet = {
          ...newTweet,
          likeCount: 0,
          likedByMe: false,
          user: {
            id,
            name,
            image,
          },
        };
        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              tweets: [newCacheTweet, ...oldData.pages[0].tweets],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
    },
  });
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createTweet.mutate({ content: inputValue });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 border-b px-4 py-2"
    >
      <div className="flex gap-4">
        <ProfileImage src={image} />
        <textarea
          ref={inputRef}
          style={{ height: 0 }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none"
          placeholder="What's happening?"
        />
      </div>
      <Button className="self-end">Tweet</Button>
    </form>
  );
}

export default function NewTweetForm() {
  const session = useSession();
  if (session.status === "authenticated") {
    const { id, name, image } = session.data.user;
    return <Form id={id} name={name ?? undefined} image={image ?? undefined} />;
  } else {
    return undefined;
  }
}

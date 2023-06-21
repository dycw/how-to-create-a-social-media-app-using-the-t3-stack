import Button from "@/components/Button";
import ProfileImage from "@/components/ProfileImage";
import { useSession } from "next-auth/react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
  if (textArea === undefined) {
    return;
  }
  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
}

function Form({ image }: { image?: string | undefined }) {
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const [inputValue, setInputValue] = useState("");

  useLayoutEffect(() => updateTextAreaSize(textAreaRef.current), [inputValue]);
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  return (
    <form className="flex flex-col gap-2 border-b px-4 py-2">
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
  return session.status === "authenticated" ? (
    <Form image={session.data.user.image ?? undefined} />
  ) : null;
}

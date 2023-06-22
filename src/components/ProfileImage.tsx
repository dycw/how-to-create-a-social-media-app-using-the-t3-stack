import Image from "next/image";
import { VscAccount } from "react-icons/vsc";

export default function ProfileImage({
  src,
  className = "",
}: {
  src?: string | undefined;
  className?: string | undefined;
}) {
  return (
    <div
      className={`relative h-12 w-12 overflow-hidden rounded-full ${className}`}
    >
      {src === undefined ? (
        <VscAccount className="h-full w-full" />
      ) : (
        <Image src={src} alt="Profile image" quality={100} fill />
      )}
    </div>
  );
}

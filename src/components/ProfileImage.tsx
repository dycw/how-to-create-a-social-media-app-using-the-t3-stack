import Image from "next/image";

export default function ProfileImage({
  src,
  className = "",
}: {
  src?: string | undefined;
  className?: string;
}) {
  return (
    <div
      className={`relative h-12 w-12 overflow-hidden rounded-full ${className}`}
    >
      {src === undefined ? null : (
        <Image src={src} alt="Profile image" quality={100} fill />
      )}
    </div>
  );
}

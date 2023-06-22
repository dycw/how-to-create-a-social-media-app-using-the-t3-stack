export default function IconHoverEffect({
  children,
  red = false,
}: {
  children: React.ReactNode;
  red?: boolean;
}) {
  return (
    <div
      className={`rounded-full p-2 transition-colors ${
        red
          ? "outline-red-400 hover:bg-red-200 focus-visible:bg-red-200 group-hover:bg-red-200 group-focus-visible:bg-red-200"
          : "outline-gray-400 hover:bg-gray-200 focus-visible:bg-gray-200 group-hover:bg-gray-200 group-focus-visible:bg-gray-200"
      }`}
    >
      {children}
    </div>
  );
}

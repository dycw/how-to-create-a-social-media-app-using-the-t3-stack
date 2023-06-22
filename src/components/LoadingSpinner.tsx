import { VscRefresh } from "react-icons/vsc";

export default function LoadingSpinner({ big = false }: { big?: boolean }) {
  return (
    <div className="flex justify-center p-2">
      <VscRefresh
        className={`animate-spin ${big ? "h-16 w-16" : "h-10 w-10"}`}
      />
    </div>
  );
}

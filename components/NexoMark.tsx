import Image from "next/image";
import Link from "next/link";

export function NexoMark({ className = "app-wordmark" }: { className?: string }) {
  return (
    <Link className={className} href="/" aria-label="Nexo home">
      <Image alt="" aria-hidden="true" className="nexo-logo" height={40} priority src="/brand/nexo-mark.png" width={40} />
      <strong>Nexo</strong>
    </Link>
  );
}

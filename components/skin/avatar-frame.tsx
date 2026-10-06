import Image from "next/image";

export function AvatarFrame({
  src,
  name,
}: {
  src: string | null;
  name: string;
}) {
  return (
    <div className="avatar-frame">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <Image
          src="/default-avatar.svg"
          alt={name}
          width={136}
          height={136}
          className="h-full w-full"
          priority
        />
      )}
    </div>
  );
}

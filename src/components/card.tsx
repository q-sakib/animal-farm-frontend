import * as React from 'react';
import { AnimalCardProps } from '@/types';
import Image from "next/image";
{/* <Image
  className="dark:invert"
  src="/next.svg"
  alt="Next.js logo"
  width={160}
  height={191}
  priority
/> */}
export const AnimalCard: React.FC<AnimalCardProps> = ({ imageUrl, name }) => {
  return (
    <>
      <div className="flex flex-col flex-1 text-lg leading-none uppercase whitespace-nowrap text-white text-opacity-80">
        <Image
          loading="lazy"
          src={imageUrl}
          alt={`img ${name}`}
          width={320}
          height={382}
          className="object-contain w-40 rounded-lg aspect-[0.84]"
        />
        <div className="self-center mt-3.5">{name}</div>
      </div>
    </>
  );
};
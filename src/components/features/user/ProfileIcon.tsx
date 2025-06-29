import { api } from "@/utils/api";
import Image from "next/image";
import { useState, useEffect } from "react";

interface ProfileIconProps {
  user: {
    imagePath?: string;
    username?: string;
  };
  size?: number;
  sasToken?: string | null;
  className?: string;
  quality?: number;
}

export default function ProfileIcon({ user, size = 40, sasToken = null, className = '', quality = 75 }: ProfileIconProps) {
  const [localSasToken, setLocalSasToken] = useState<string | null>(sasToken);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchSasToken = async () => {
      if (!sasToken) {
        try {
          const containerName = 'images';
          const res = await api.get(`/sas/token?containerName=${containerName}`);
          setLocalSasToken(res.data.sasToken);
        } catch (err) {
          console.error('Failed to fetch SAS token:', err);
        }
      }
    };
    fetchSasToken();
  }, []);

  useEffect(() => {
    if (user.imagePath && localSasToken) {
      setImageUrl(`${user.imagePath}?${localSasToken}`);
    }
  }, [user.imagePath, localSasToken]);

  return imageUrl ? (
    <Image
      src={imageUrl}
      alt="Profile"
      quality={quality}
      width={size}
      height={size}
      className={`rounded-full bg-gray-200 ${className}`}
    />
  ) : (
    <div
      className={`rounded-full bg-gray-300 flex items-center justify-center ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <span className="text-gray-500 text-lg">
        {user.username?.[0]?.toUpperCase() ?? "?"}
      </span>
    </div>
  );
}
import { api } from "@/lib/api";
import { useState, useEffect } from "react";

interface ProfileIconProps {
  user: {
    imagePath?: string;
    username?: string;
  };
  size?: number;
  sasToken?: string | null;
  className?: string;
}

export default function ProfileIcon({ user, size = 40, sasToken = null, className = '' }: ProfileIconProps) {
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
    <img
      src={imageUrl}
      alt="Profile"
      className={`rounded-full object-cover bg-gray-200 ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
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
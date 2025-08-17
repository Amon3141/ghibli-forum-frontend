import { useState, useEffect } from "react";
import { api } from "@/utils/api";

import { User } from "@/types/database";
import { Movie } from "@/types/database";
import { ItemCardColor } from "./ProfileItemCard";

import InputField from "@/components/ui/InputField";
import GeneralButton from "@/components/ui/GeneralButton";

interface BasicProfileEditingProps {
  user: User;
  onUserUpdate?: (updatedUser: Partial<User>) => void;
  onSave?: () => Promise<void>;
  onCancel?: () => void;
}

/**
 * プロフィール情報 (編集時)
 */
export default function BasicProfileEditing({
  user, onUserUpdate, onSave, onCancel
}: BasicProfileEditingProps) {
  const bioMaxLength = 200;
  const defaultFormData = {
    username: user.username || '',
    bio: user.bio || '',
    favoriteCharacter: user.favoriteCharacter || '',
    favoriteMovieId: user.favoriteMovie?.id || undefined
  }

  const [formData, setFormData] = useState(defaultFormData);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onUserUpdate?.(updatedData);
  };

  const handleMovieChange = (movieId: string) => {
    if (movieId === "") return;
    const updatedData = { ...formData, favoriteMovieId: parseInt(movieId) };
    setFormData(updatedData);
    onUserUpdate?.(updatedData);
  };

  const handleSaveEdit = async () => {
    if (
      formData.bio.length > bioMaxLength ||
      formData.username.length === 0
    ) {
      return;
    }
    setIsSaving(true);
    await onSave?.();
    setIsSaving(false);
  }

  useEffect(() => {
    setFormData(defaultFormData);
  }, [user]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get('/movies');
        setMovies(response.data);
      } catch (error) {
        setMovies([]);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="w-full">
        {/* Username */}
        <label className="block text-sm font-medium text-textcolor/80 mb-1">
          ユーザー名
        </label>
        <InputField
          value={formData.username}
          onChange={(e) => handleInputChange('username', e.target.value)}
          placeholder="ユーザー名を入力してください"
        />
      </div>

      {/* Bio */}
      <div className="w-full">
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-textcolor/80">
            プロフィール文
          </label>
          <span className="small-text">
            <span className={`
              ${formData.bio.length > bioMaxLength ? 'text-red-700' : 'text-textcolor/60'} mr-0.5
            `}>
              {formData.bio.length}
            </span>
            /
            <span className="ml-0.5">{bioMaxLength}</span>
          </span>
        </div>
        <textarea
          value={formData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          placeholder="自己紹介を入力してください"
          className="
            w-full resize-none rounded-md
            border-1 border-gray-300 bg-gray-50
            small-text leading-relaxed 
            py-1.5 sm:py-2 px-2 sm:px-2.5
            focus:outline-none focus:ring-0
            block
          "
          rows={3}
          maxLength={bioMaxLength + 50}
        />
        {formData.bio.length > bioMaxLength && (
          <div className="text-right text-xs text-textcolor/80 mt-1">
            プロフィール文が長すぎます
          </div>
        )}
      </div>

      {/* Favorite Character Input */}
      <div className="w-full">
        <label className="block text-sm font-medium text-textcolor/80 mb-1">
          好きなキャラクター
        </label>
        <InputField
          value={formData.favoriteCharacter}
          onChange={(e) => handleInputChange('favoriteCharacter', e.target.value)}
          placeholder="好きなキャラクターを入力してください"
        />
      </div>

      {/* Favorite Movie Selection */}
      <div className="w-full">
        <label className="block text-sm font-medium text-textcolor/80 mb-1">
          好きな作品
        </label>
        <select
          value={formData.favoriteMovieId || ''}
          onChange={(e) => handleMovieChange(e.target.value)}
          className="
            small-text rounded-md w-full
            border-1 border-gray-300 bg-gray-50 leading-relaxed
            py-1.5 sm:py-2 px-1 sm:px-2
            focus:outline-none focus:ring-0
          "
        >
          <option value=''>作品を選択してください</option>
          {movies.map((movie) => (
            <option key={movie.id} value={movie.id}>
              {movie.title}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end w-full gap-3 mt-3">
        {onCancel && (
          <GeneralButton onClick={onCancel}>
            キャンセル
          </GeneralButton>
        )}
        <GeneralButton 
          color="primary" 
          onClick={handleSaveEdit} 
          disabled={formData.bio?.length > bioMaxLength || formData.username.length === 0}
          className={`
            bg-primary/80 border-primary/80
            ${formData.bio?.length > bioMaxLength || formData.username.length === 0 ? 'opacity-60 cursor-not-allowed' : ''}
          `}
        >
          変更を保存
        </GeneralButton>
      </div>
    </div>
  )
}
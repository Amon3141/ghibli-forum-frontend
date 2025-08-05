import { useState, useEffect } from "react";
import { api } from "@/utils/api";

import { User } from "@/types/database/user";
import { Movie } from "@/types/database/movie";
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
  const defaultFormData = {
    username: user.username || '',
    bio: user.bio || '',
    favoriteCharacter: user.favoriteCharacter || '',
    favoriteMovieId: user.favoriteMovieId || undefined
  }

  const [formData, setFormData] = useState(defaultFormData);
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    setFormData(defaultFormData);
  }, [user]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get('/movies');
        setMovies(response.data);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      }
    };
    fetchMovies();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    // For bio field, limit to 200 characters
    if (field === 'bio' && value.length > 200) {
      return;
    }
    
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onUserUpdate?.(updatedData);
  };

  const handleMovieChange = (movieId: string) => {
    const updatedData = { ...formData, favoriteMovieId: parseInt(movieId) || undefined };
    setFormData(updatedData);
    onUserUpdate?.(updatedData);
  };

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
          placeholder="ユーザー名"
        />
      </div>

      {/* Bio */}
      <div className="w-full">
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-textcolor/80">
            プロフィール文
          </label>
          <span className="small-text">
            <span className={`${formData.bio.length > 160 ? 'text-red-700' : 'text-textcolor/60'} mr-0.5`}>{formData.bio.length}</span>/160
          </span>
        </div>
        <textarea
          value={formData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          placeholder="自己紹介を入力してください..."
          className="
            w-full resize-none rounded-md
            border-1 border-gray-300 bg-gray-50
            text-textcolor/90 small-text leading-relaxed 
            py-1.5 sm:py-2 px-2 sm:px-3
            focus:outline-none focus:ring-0
            block
          "
          rows={3}
          maxLength={200}
        />
      </div>

      {/* Favorite Character Input */}
      <div className="w-full">
        <label className="block text-sm font-medium text-textcolor/80 mb-1">
          好きなキャラクター
        </label>
        <InputField
          value={formData.favoriteCharacter}
          onChange={(e) => handleInputChange('favoriteCharacter', e.target.value)}
          placeholder="好きなキャラクター"
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
          <option value="">作品を選択してください</option>
          {movies.map((movie) => (
            <option key={movie.id} value={movie.id}>
              {movie.title}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end w-full gap-3 mt-3">
        <GeneralButton onClick={onCancel}>
          キャンセル
        </GeneralButton>
        <GeneralButton color="primary" onClick={onSave} className="bg-primary/80 border-primary/80">
          変更を保存
        </GeneralButton>
      </div>
    </div>
  )
}
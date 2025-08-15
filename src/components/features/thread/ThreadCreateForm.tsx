"use client";
import { useState } from "react";
import InputField from "@/components/ui/InputField";
import GeneralButton from "@/components/ui/GeneralButton";
import { Thread } from "@/types/database";
import { api } from "@/utils/api";

interface ThreadFormData {
  title: string;
  description: string
};

interface ThreadCreateFormProps {
  movieId: number;
  setShowThreadForm: React.Dispatch<React.SetStateAction<boolean>>;
  onCreateThread: (newThread: Thread) => void;
}

export default function ThreadCreateForm({ movieId, setShowThreadForm, onCreateThread }: ThreadCreateFormProps) {
  const [newThread, setNewThread] = useState<ThreadFormData>({
    title: '',
    description: ''
  });
  const [createThreadError, setCreateThreadError] = useState<string | null>(null);

  const resetThreadForm = () => {
    setNewThread({
      title: '',
      description: ''
    });
    setCreateThreadError(null);
    setShowThreadForm(false);
  }

  const handleCreateThread = async () => {
    try {
      const response = await api.post(`/movies/${movieId}/threads`, newThread);
      onCreateThread(response.data);
      resetThreadForm();
    } catch (err: any) {
      setCreateThreadError(err.response?.data?.error || 'スレッドの作成に失敗しました');
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleCreateThread();
      }}
      className="
        bg-gray-50 rounded-md border-1 border-gray-200 w-2/3 p-3 sm:p-4 space-y-3
      "
    >
      <h3 className="text-base sm:text-lg font-bold text-textcolor/90">新しいスレッドを作成</h3>
      <div className="flex flex-col items-start space-y-3 mb-4">
        <InputField
          value={newThread.title}
          onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
          placeholder="タイトル"
        />
        <InputField
          value={newThread.description}
          onChange={(e) => setNewThread({ ...newThread, description: e.target.value })}
          placeholder="概要"
        />
      </div>
      <div className="flex justify-end items-center gap-2">
        <GeneralButton type="button" onClick={resetThreadForm} color="default">キャンセル</GeneralButton>
        <GeneralButton type="submit" color="primary">作成</GeneralButton>
      </div>
      {createThreadError && (
        <div className="rounded-sm bg-red-100 p-4">
          <p className="text-textcolor/80">{createThreadError}</p>
        </div>
      )}
    </form>
  )
}
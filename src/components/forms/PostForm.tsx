'use client';

import { createPost, deletePost, updatePost } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';

export default function PostForm({
  data,
  classId,
  type,
  setOpen,
  id,
}: {
  data: any;
  classId: number;
  type: 'create' | 'update' | 'delete';
  setOpen: any;
  id: number | undefined;
}) {
  const [state, formAction] = useFormState(deletePost, {
    success: false,
    error: false,
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`This post has been deleted!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  return type === 'delete' && id ? (
    <form action={formAction} className="p-4 flex flex-col gap-4">
      <input type="text | number" name="id" value={id} hidden />
      <span className="text-center font-medium">
        All data inside will be lost. Are you sure you want to delete this post?
      </span>
      <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
        Delete
      </button>
    </form>
  ) : type === 'create' || type === 'update' ? (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (type === 'create') {
          await createPost(formData);
          toast('Post has been created!');
          setOpen(false);
        } else {
          await updatePost(formData);
          toast('Post has been updated!');
          setOpen(false);
        }
      }}
    >
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <input type="hidden" name="id" value={data?.id} />
        <input type="hidden" name="classId" value={classId} />
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Title Post"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
            required
            defaultValue={data?.title}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
            required
            defaultValue={data?.description}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="media" className="mb-2 block text-sm font-medium">
            Content/File *
          </label>
          {data?.media?.[0]?.url && (
            <div className="flex gap-1 my-2">
              <p className="text-sm text-gray-500">Current file:</p>
              <a
                href={data.media[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {data?.media[0].fileName}
              </a>
            </div>
          )}
          <input
            type="file"
            id="media"
            name="media"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <button type="button" onClick={() => setOpen(false)}>
          Cancel
        </button>
        <button type="submit">
          {type == 'create' ? 'Create' : 'Update'} Post
        </button>
      </div>
    </form>
  ) : (
    'Form not found!'
  );
}

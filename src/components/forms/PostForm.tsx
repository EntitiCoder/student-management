'use client';

import { createPost, updatePost } from '@/lib/actions';

export default function PostForm({
  data,
  classId,
  type,
  setOpen,
}: {
  data: any;
  classId: number;
  type: 'create' | 'update';
  setOpen: any;
}) {
  console.log('🚀 ~ file: PostForm.tsx:15 ~ data:', data);

  return (
    <form action={type == 'create' ? createPost : updatePost}>
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
          <input
            type="file"
            id="media"
            name="media"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
            required
            // defaultValue={data?.media}
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
  );
}

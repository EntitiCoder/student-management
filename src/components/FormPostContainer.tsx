'use client';

import PostForm from '@/components/forms/PostForm';
import Image from 'next/image';
import { useState } from 'react';

interface FormPostContainerProps {
  type: string;
  id: number;
  classId: number;
}

const FormPostContainer = ({ type, id, classId }: FormPostContainerProps) => {
  const size = type === 'create' ? 'w-8 h-8' : 'w-7 h-7';

  const [open, setOpen] = useState(false);

  return (
    <div className="">
      <button
        className={`${size} flex items-center justify-center rounded-full bg-[#000]`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <PostForm />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormPostContainer;

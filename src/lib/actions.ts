'use server';

import { v2 as cloudinary } from 'cloudinary';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { ClassSchema } from './formValidationSchemas';
import prisma from './prisma';

// Require the cloudinary library

// Return "https" URLs by setting secure: true
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Log the configuration
console.log(cloudinary.config());

type CurrentState = { success: boolean; error: boolean };

export const createStudent = async (data: any) => {
  console.log('createStudent');
  console.log(data);
};

export const updateStudent = async (data: any) => {
  console.log('updateStudent');
  console.log(data);
};

export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  console.log('create');
  try {
    await prisma.class.create({
      data,
    });
    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.update({
      where: {
        id: data.id,
      },
      data,
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

const FormSchema = z.object({
  classId: z.number(),
  title: z.string(),
  description: z.string(),
  media: z.any(),
});

export async function createPost(formData: FormData) {
  const file = formData.get('media') as File;
  const { url, type, fileName } = await saveFile(file);

  const { title, description, media, classId } = FormSchema.parse({
    classId: Number(formData.get('classId')),
    title: formData.get('title'),
    description: formData.get('description'),
    media: [
      {
        url,
        type,
        fileName,
      },
    ],
  });

  try {
    await prisma.post.create({
      data: {
        title: title,
        description: description,
        media: {
          create: media,
        },
        class: {
          connect: {
            id: classId,
          },
        },
      },
    });
    console.log('success');
    revalidatePath(`/list/classes/${classId}`);
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }

  // redirect('/');
}

export async function updatePost(formData: FormData) {
  const file = formData.get('media') as File;
  const { url, type, fileName } = await saveFile(file);
  console.log('🚀 ~ file: actions.ts:116 ~ updatePost ~ fileName:', fileName);

  const { title, description, media, classId } = FormSchema.parse({
    classId: Number(formData.get('classId')),
    title: formData.get('title'),
    description: formData.get('description'),
    media: [
      {
        url,
        type,
        fileName,
      },
    ],
  });

  try {
    await prisma.post.update({
      where: {
        id: Number(formData.get('id')),
      },
      data: {
        title: title,
        description: description,
        media: {
          // Assuming you want to replace or update media based on a unique identifier
          deleteMany: {}, // Deletes existing media entries if needed
          create: media, // Creates new media entries based on provided media data
        },
        class: {
          connect: {
            id: classId,
          },
        },
      },
    });
    console.log('success update post');
    revalidatePath(`/list/classes/${classId}`);
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }

  // redirect('/');
}

async function saveFile(file: File) {
  //'image/jpeg',
  // 'application/pdf'
  console.log('🚀 ~ file: actions.ts:156 ~ saveFile ~ file:', file);
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const result = await new Promise<CloudinaryUploadResponse>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'auto',
          },
          function (error, result) {
            if (error || result === undefined) {
              reject(error || new Error('Upload result is undefined.'));
              return;
            }
            resolve(result);
          }
        )
        .end(buffer);
    }
  );
  const { url } = result;
  return { url, type: file.type, fileName: file.name };
}

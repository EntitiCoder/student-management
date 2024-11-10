'use server';

import { v2 as cloudinary } from 'cloudinary';

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
  pathToMoney: z.string(),
  mockupImages: z.string(),
});

export async function createPost(formData: FormData) {
  const file = formData.get('mockupImages') as File;
  const url = await saveFile(file);

  const { title, description, pathToMoney, mockupImages, classId } =
    FormSchema.parse({
      classId: Number(formData.get('classId')),
      title: formData.get('title'),
      description: formData.get('description'),
      pathToMoney: formData.get('pathToMoney'),
      mockupImages: url,
    });

  try {
    await prisma.post.create({
      data: {
        title: title,
        description: description,
        pathToMoney: pathToMoney,
        mockupImages: mockupImages,
        class: {
          connect: {
            id: classId,
          },
        },
      },
    });
    console.log('success');
    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }

  // redirect('/');
}

interface UploadResult {
  url: string;
}

async function saveFile(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const result = await new Promise<UploadResult>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: 'raw',
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
  });

  return result.url;
}

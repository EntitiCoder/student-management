'use server';

import { v2 as cloudinary } from 'cloudinary';

import { clerkClient } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { ClassSchema, StudentSchema } from './formValidationSchemas';
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

export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  console.log('student');
  try {
    const classItem = await prisma.class.findUnique({
      where: { id: data.classId },
      include: { _count: { select: { students: true } } },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      return { success: false, error: true };
    }

    const clerk = await clerkClient();
    const user = await clerk.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: 'student' },
    });

    console.log('🚀 ~ file: actions.ts:52 ~ user:', user);

    await prisma.student.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || '',
        img: data.img || null,
        bloodType: data.bloodType || '',
        sex: data.sex,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        // parentId: data.parentId,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateStudent = async (data: any) => {
  console.log('updateStudent');
  console.log(data);
};

export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get('id') as string;
  try {
    const clerk = await clerkClient();
    await clerk.users.deleteUser(id);
    await prisma.student.delete({
      where: {
        id: id,
      },
    });
    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.create({
      data,
    });
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
  console.log('🚀 ~ file: actions.ts:122 ~ data:', data);
  let media: FileUpload[] = [];
  // const file = data.photo as File | null;

  // if (file && file.size > 0) {
  //   const { url, type, fileName } = await saveFile(file);
  //   media = [
  //     {
  //       url,
  //       type,
  //       fileName,
  //     },
  //   ];
  // }
  try {
    await prisma.class.update({
      where: {
        id: data.id,
      },
      data: {
        ...data,
        // photo: media.length > 0 ? media?.[0]?.url : undefined,
      },
    });
    console.log('success update class');
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteClass = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get('id');
  try {
    await prisma.class.delete({
      where: {
        id: Number(id),
      },
    });
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
  let media: FileUpload[] = [];
  const file = formData.get('media') as File | null;

  if (file && file.size > 0) {
    const { url, type, fileName } = await saveFile(file);
    media = [
      {
        url,
        type,
        fileName,
      },
    ];
  }

  // Parse the form data
  const { title, description, classId } = FormSchema.parse({
    classId: Number(formData.get('classId')),
    title: formData.get('title'),
    description: formData.get('description'),
    media,
  });

  try {
    await prisma.post.create({
      data: {
        title: title,
        description: description,
        media: {
          create: media.length > 0 ? media : undefined,
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
  let media: FileUpload[] = [];
  const file = formData.get('media') as File | null;

  if (file && file.size > 0) {
    const { url, type, fileName } = await saveFile(file);
    media = [
      {
        url,
        type,
        fileName,
      },
    ];
  }
  // Parse the form data
  const { title, description, classId } = FormSchema.parse({
    classId: Number(formData.get('classId')),
    title: formData.get('title'),
    description: formData.get('description'),
    media,
  });

  try {
    await prisma.post.update({
      where: {
        id: Number(formData.get('id')),
      },
      data: {
        title: title,
        description: description,
        media:
          media.length > 0
            ? {
              deleteMany: {},
              create: media,
            }
            : undefined,
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

export const deletePost = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get('id');
  try {
    await prisma.post.delete({
      where: {
        id: Number(id),
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

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
            resource_type: file.type === 'image/jpeg' ? 'image' : 'raw',
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

// Post Submission Actions

export async function createSubmission(formData: FormData) {
  try {
    const studentId = formData.get('studentId') as string;
    const postId = Number(formData.get('postId'));
    const files = formData.getAll('files') as File[];

    if (!studentId || !postId) {
      return { success: false, error: true, message: 'Missing required fields' };
    }

    if (!files || files.length === 0 || files[0].size === 0) {
      return { success: false, error: true, message: 'At least one file is required' };
    }

    // Upload files to Cloudinary
    const uploadedFiles = await Promise.all(
      files.filter(f => f.size > 0).map(async (file) => {
        const { url, fileName } = await saveFile(file);
        return { url, fileName };
      })
    );

    // Use upsert to create or update submission
    const submission = await prisma.postSubmission.upsert({
      where: {
        studentId_postId: {
          studentId,
          postId,
        },
      },
      update: {
        status: 'PENDING',
        submittedAt: new Date(),
        reviewedAt: null,
        reviewedById: null,
        rejectionReason: null,
        teacherNote: null,
        files: {
          deleteMany: {}, // Delete old files
          create: uploadedFiles,
        },
      },
      create: {
        studentId,
        postId,
        status: 'PENDING',
        files: {
          create: uploadedFiles,
        },
      },
    });

    // Get the classId for revalidation
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { classId: true },
    });

    if (post) {
      revalidatePath(`/list/classes/${post.classId}`);
    }

    console.log('✅ Submission created/updated successfully');
    return { success: true, error: false };
  } catch (err) {
    console.error('❌ Error creating submission:', err);
    return { success: false, error: true, message: 'Failed to create submission' };
  }
}

export async function approveSubmission(
  submissionId: number,
  teacherId: string,
  teacherNote?: string,
  finalPoints?: number
) {
  try {
    // Verify teacher exists
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
    });

    if (!teacher) {
      console.error('❌ Teacher not found:', teacherId);
      return { success: false, error: true, message: 'Teacher not found' };
    }

    const submission = await prisma.postSubmission.update({
      where: {
        id: submissionId,
      },
      data: {
        status: 'APPROVED',
        reviewedAt: new Date(),
        reviewedById: teacherId,
        teacherNote: teacherNote || null,
        finalPoints: finalPoints || null,
      },
      include: {
        post: {
          select: {
            classId: true,
          },
        },
      },
    });

    revalidatePath(`/list/classes/${submission.post.classId}`);
    console.log('✅ Submission approved successfully');
    return { success: true, error: false };
  } catch (err) {
    console.error('❌ Error approving submission:', err);
    return { success: false, error: true, message: 'Failed to approve submission' };
  }
}

export async function rejectSubmission(
  submissionId: number,
  teacherId: string,
  rejectionReason: string,
  teacherNote?: string
) {
  try {
    if (!rejectionReason || rejectionReason.trim() === '') {
      return { success: false, error: true, message: 'Rejection reason is required' };
    }

    // Verify teacher exists
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
    });

    if (!teacher) {
      console.error('❌ Teacher not found:', teacherId);
      return { success: false, error: true, message: 'Teacher not found' };
    }

    const submission = await prisma.postSubmission.update({
      where: {
        id: submissionId,
      },
      data: {
        status: 'REJECTED',
        reviewedAt: new Date(),
        reviewedById: teacherId,
        rejectionReason,
        teacherNote: teacherNote || null,
      },
      include: {
        post: {
          select: {
            classId: true,
          },
        },
      },
    });

    revalidatePath(`/list/classes/${submission.post.classId}`);
    console.log('✅ Submission rejected successfully');
    return { success: true, error: false };
  } catch (err) {
    console.error('❌ Error rejecting submission:', err);
    return { success: false, error: true, message: 'Failed to reject submission' };
  }
}


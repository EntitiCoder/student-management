'use server';

import { ClassSchema } from './formValidationSchemas';
import prisma from './prisma';

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

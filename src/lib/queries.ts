// src/queries/studentQueries.ts
import { clerkClient } from '@clerk/nextjs/server';
import { Prisma } from '@prisma/client';
import prisma from './prisma';
import { ITEM_PER_PAGE } from './settings';

export const getStudents = async (
  queryParams: { [key: string]: string | undefined },
  page: number
) => {
  let query: Prisma.StudentWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'classId':
            query.classId = Number(value);
            break;
          case 'search':
            query = {
              OR: [
                { surname: { contains: value, mode: 'insensitive' } },
                { name: { contains: value, mode: 'insensitive' } },
                { username: { contains: value, mode: 'insensitive' } },
              ],
            };
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.student.findMany({
      where: query,
      include: {
        class: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    }),
    prisma.student.count({ where: query }),
  ]);

  return { data, count };
};

export const getSingleStudent = async (studentId: string) => {
  const student = await prisma.student?.findUnique({
    where: {
      id: studentId,
    },
    include: {
      // grade: true,
      class: {
        include: {
          posts: true,
        },
      },
    },
  });
  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(studentId);
  // const { lastSignInAt, imageUrl } = clerkUser || {};
  return {
    ...student,
    ...clerkUser,
  };
};

export const getClasses = async (query: any, page: number) => {
  const [data, count] = await prisma.$transaction([
    prisma.class.findMany({
      where: query,
      include: {
        grade: {
          select: {
            id: true,
          },
        },
        students: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    }),
    prisma.class.count({ where: query }),
  ]);

  return { data, count };
};

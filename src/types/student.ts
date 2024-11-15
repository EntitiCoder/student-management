interface Student {
  username: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  img: string | null;
  bloodType: string;
  sex: 'FEMALE' | 'MALE';
  createdAt: Date;
  // parentId: string;
  classId: number;
  gradeId: number;
  birthday: Date;
  photo: string;
  grade: {
    id: number;
    level: number;
  };
}

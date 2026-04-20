import { RegisterUserInput } from './user.schema';

export const createUser = async (data: RegisterUserInput) => {
  console.log(data);
  return data;
};

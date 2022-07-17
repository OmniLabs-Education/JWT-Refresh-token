import { User } from "../entities/User";
import { getRepository } from "typeorm";
import UserToken from "../entities/UserTokens";

export const UserRepository = () => {
  return getRepository(User);
};

export const UserTokensRepository = () => {
  return getRepository(UserToken);
};

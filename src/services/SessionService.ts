import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { User } from "../entities/User";
import { getRepository } from "typeorm";
import { UserRepository, UserTokensRepository } from "../repositories";
import auth from "../config/auth";
import dayjs from "dayjs";

type UserRequest = {
  name: string;
  password: string;
};

export class SessionService {
  async execute({ name, password }: UserRequest) {
    const repo = UserRepository();
    const userTokenRepository = UserTokensRepository();

    const user = await repo.findOne({ name });

    if (!user) {
      return new Error("User does not exists!");
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      return new Error("User or Password incorrect");
    }

    const {
      expires_in_refresh_token,
      expires_in_token,
      expires_refresh_token_days,
      secret_refresh_token,
      secret_token
    } = auth;

    const token = sign({}, secret_token, {
      subject: user.id,
      expiresIn: expires_in_token
    });

    const refresh_token = sign({ name }, secret_refresh_token, {
      subject: user.id,
      expiresIn: expires_in_refresh_token
    })

    const refresh_token_expires_date = dayjs().add(expires_refresh_token_days, 'days').toDate();

    const refresh_token_created = await userTokenRepository.create({
      user_id: user.id,
      refresh_token,
      expires_date: refresh_token_expires_date
    })

    await userTokenRepository.save(refresh_token_created)

    return { token, refresh_token };
  }
}

import dayjs from "dayjs";
import { sign, verify } from "jsonwebtoken";
import auth from "../config/auth";
import { UserTokensRepository } from "../repositories";

interface IPayload {
  name: string;
  sub: string;
}

class RefreshTokenService {
  async execute(refresh_token: string) {
    const userTokenRepository = UserTokensRepository();

    const { name, sub } = verify(
      refresh_token,
      auth.secret_refresh_token
    ) as IPayload;

    const user_id = sub;

    const userToken = await userTokenRepository.findOne({
      where: {
        user_id,
        refresh_token
      }
    })

    if(!userToken) {
      throw new Error('Refresh token não encontrado')
    }

    await userTokenRepository.delete({
      id: userToken.id
    })

    const new_refresh_token = sign({ name }, auth.secret_refresh_token, {
      subject: sub,
      expiresIn: auth.expires_in_refresh_token
    })

    const refresh_token_expires_date = dayjs().add(auth.expires_refresh_token_days, 'days').toDate();

    const refresh_token_created = await userTokenRepository.create({
      user_id: user_id,
      refresh_token,
      expires_date: refresh_token_expires_date
    })

    await userTokenRepository.save(refresh_token_created)

    const newToken = sign({}, auth.secret_token, {
      subject: user_id,
      expiresIn: auth.expires_in_token
    })

    return {
      refresh_token,
      token: newToken
    }
  }
}

export { RefreshTokenService }
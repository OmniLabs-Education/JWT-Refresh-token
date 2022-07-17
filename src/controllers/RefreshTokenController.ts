import { Request, Response } from 'express';
import { RefreshTokenService } from '../services/RefreshTokenService';

class RefreshTokenController {
  async handle(request: Request, response: Response) {
    const refresh_token = request.body.refresh_token;

    const refresh_token_service = new RefreshTokenService();

    const refresh_token_response = await refresh_token_service.execute(refresh_token)

    return response.json(refresh_token_response)
  }
}

export { RefreshTokenController }
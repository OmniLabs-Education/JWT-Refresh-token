import {Router} from 'express';
import { CreateUserController } from './controllers/CreateUserController';
import { RefreshTokenController } from './controllers/RefreshTokenController';
import { SessionController } from './controllers/SessionController';
import { ShowUserController } from './controllers/ShowUserController';
import { ensuredAuthenticated } from './middlewares/ensureAuthenticated';

const routes = Router();

routes.post("/users", new CreateUserController().handle);
routes.post("/login", new SessionController().handle);
routes.get("/me", ensuredAuthenticated(), new ShowUserController().handle);
routes.post("/refresh-token", new RefreshTokenController().handle)

export { routes }
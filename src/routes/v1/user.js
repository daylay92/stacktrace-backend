import { Router } from 'express';
import { UserMiddleware } from '../../middlewares';
import { UserController } from '../../controllers';

const { validateId } = UserMiddleware;
const { getUser, getUsers } = UserController;

const router = Router();
router.get('/', getUsers);
router.get('/:id', validateId, getUser);

export default router;

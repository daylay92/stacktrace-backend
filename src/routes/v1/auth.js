import { Router } from 'express';
import AuthMiddleware from '../../middlewares';
import Auth from '../../controllers';

const { signup } = Auth;
const { validate, checkEmailAlreadyExists } = AuthMiddleware;

const router = Router();

router.post('/signup', validate, checkEmailAlreadyExists, signup);

export default router;

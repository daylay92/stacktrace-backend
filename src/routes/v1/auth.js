import { Router } from 'express';
import { AuthMiddleware } from '../../middlewares';
import { AuthController } from '../../controllers';

const { signup, signin, logout } = AuthController;
const {
  validate,
  authenticate,
  checkEmailAlreadyExists,
  validateLoginFields,
  verifyIfExistingUser
} = AuthMiddleware;

const router = Router();

router.post('/signup', validate, checkEmailAlreadyExists, signup);
router.post('/signin', validateLoginFields, verifyIfExistingUser, signin);
router.get('/logout', authenticate, logout);

export default router;

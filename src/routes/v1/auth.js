import { Router } from 'express';
import { AuthMiddleware } from '../../middlewares';
import { AuthController } from '../../controllers';

const { signup, signin } = AuthController;
const {
  validate,
  checkEmailAlreadyExists,
  validateLoginFields,
  verifyIfExistingUser
} = AuthMiddleware;

const router = Router();

router.post('/signup', validate, checkEmailAlreadyExists, signup);
router.post('/signin', validateLoginFields, verifyIfExistingUser, signin);

export default router;

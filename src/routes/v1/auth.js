import { Router } from 'express';
import AuthMiddleware from '../../middlewares';
import Auth from '../../controllers';

const { signup, signin } = Auth;
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

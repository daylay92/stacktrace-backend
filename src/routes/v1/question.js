import { Router } from 'express';
import { QuestionMiddleware, AuthMiddleware } from '../../middlewares';
import { QuestionController } from '../../controllers';

const { validate } = QuestionMiddleware;
const { authenticate } = AuthMiddleware;
const { create } = QuestionController;

const router = Router();
router.post('/', authenticate, validate, create);

export default router;

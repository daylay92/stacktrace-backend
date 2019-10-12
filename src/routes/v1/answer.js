import { Router } from 'express';
import { AnswerMiddleware } from '../../middlewares';
import { AnswerController } from '../../controllers';

const { validateId } = AnswerMiddleware;
const { getAnswerById } = AnswerController;

const router = Router();

router.get('/:id', validateId, getAnswerById);

export default router;

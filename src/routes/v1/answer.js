import { Router } from 'express';
import { AnswerMiddleware } from '../../middlewares';
import { AnswerController } from '../../controllers';

const { validateId } = AnswerMiddleware;
const { getAnswerById, getAnswers } = AnswerController;

const router = Router();

router.get('/', getAnswers);
router.get('/:id', validateId, getAnswerById);

export default router;

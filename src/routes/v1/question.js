import { Router } from 'express';
import { QuestionMiddleware, AuthMiddleware } from '../../middlewares';
import { QuestionController, AnswerController } from '../../controllers';

const {
  validate,
  validateId,
  syncUpVote,
  syncDownVote,
  syncUpVoteWithDownVote,
  syncDownVoteWithUpVote
} = QuestionMiddleware;
const { authenticate } = AuthMiddleware;
const { create, getQuestions, getQuestionById, upDateQuestion } = QuestionController;
const { createAnswer } = AnswerController;

const router = Router();
router.post('/', authenticate, validate, create);
router.get('/', getQuestions);
router.get('/:id', validateId, getQuestionById);
router.patch(
  '/upvote/:id',
  authenticate,
  validateId,
  syncUpVoteWithDownVote,
  syncUpVote,
  upDateQuestion
);
router.patch(
  '/downvote/:id',
  authenticate,
  validateId,
  syncDownVoteWithUpVote,
  syncDownVote,
  upDateQuestion
);
router.post('/:id/answer', authenticate, validateId, validate, createAnswer);

export default router;

import { Router } from 'express';
import { QuestionMiddleware, AuthMiddleware } from '../../middlewares';
import { QuestionController } from '../../controllers';

const {
  validate,
  validateId,
  syncUpVote,
  syncDownVote,
  syncUpVoteWithDownVote,
  syncDownVoteWithUpVote
} = QuestionMiddleware;
const { authenticate } = AuthMiddleware;
const {
  create,
  getQuestions,
  getQuestionById,
  upVoteQuestion,
  downVoteQuestion
} = QuestionController;

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
  upVoteQuestion
);
router.patch(
  '/downvote/:id',
  authenticate,
  validateId,
  syncDownVoteWithUpVote,
  syncDownVote,
  downVoteQuestion
);

export default router;

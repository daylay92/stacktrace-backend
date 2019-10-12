import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import app from '..';
import { User, Question, Answer } from '../models';
import { AuthMiddleware, } from '../middlewares';
import { sinonMockResponse, errorResponse } from './dummy';

chai.use(chaiHttp);
chai.use(sinonChai);
const { checkEmailAlreadyExists, verifyIfExistingUser } = AuthMiddleware;

describe('Basic Utility Functions', () => {
  const req = {};
  const next = () => null;
  before(async () => {
    const clearUsers = User.deleteMany();
    const clearQuestions = Question.deleteMany();
    const clearAnswers = Answer.deleteMany();
    await Promise.all([clearUsers, clearQuestions, clearAnswers]);
  });
  afterEach(() => {
    if (sinon.restore) sinon.restore();
  });
  it("should respond with a 404 error if a user tries to access a route that doesn't exist", async () => {
    const res = await chai.request(app).get('/api/v1/northeast');
    expect(res).to.have.status(404);
    expect(res.body.message).to.eql('Not found');
  });
  it('should be throw an error if something goes wrong while checking for the existance of an email during signup', async () => {
    const res = sinonMockResponse(sinon);
    await checkEmailAlreadyExists(req, res, next);
    expect(res.status).to.have.been.calledWith(500);
    expect(res.json).to.have.been.calledWith(errorResponse);
  });
  it('should be throw an error if something goes wrong while checking for the existance of a user through his/her during signin', async () => {
    const res = sinonMockResponse(sinon);
    await verifyIfExistingUser(req, res, next);
    expect(res.status).to.have.been.calledWith(500);
    expect(res.json).to.have.been.calledWith(errorResponse);
  });
});

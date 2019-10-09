import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import app from '..';
import { AuthController, QuestionController } from '../controllers';
import {
  userAskingAQuestion,
  newQuestion,
  invalidQuestion,
  sinonMockResponse,
  errorResponse
} from './dummy';

const { signup } = AuthController;
const { create } = QuestionController;

chai.use(chaiHttp);
chai.use(sinonChai);
describe('Question route endpoints', () => {
  const baseUrl = '/api/v1/question';
  let token;
  before(async () => {
    const req = { body: { ...userAskingAQuestion } };
    const res = {
      status() {
        return this;
      },
      cookie() {
        return this;
      },
      json(result) {
        return result;
      }
    };
    const { data } = await signup(req, res);
    token = data.token;
  });
  afterEach(() => {
    if (sinon.restore) sinon.restore();
  });
  describe('POST /api/v1/question', () => {
    it('should allow a user to successfully ask a valid question', async () => {
      const response = await chai
        .request(app)
        .post(`${baseUrl}`)
        .send(newQuestion)
        .set('token', token);
      const { data, status } = response.body;
      delete userAskingAQuestion.password;
      expect(response).to.have.status(201);
      expect(status).to.eql('success');
      expect(data.text).to.eql('What is it like to be a software Engineer?');
      expect(response.body.data.author).to.include(userAskingAQuestion);
    });
    it('should prevent an unautheticated user from asking a question', async () => {
      const response = await chai
        .request(app)
        .post(`${baseUrl}`)
        .send(newQuestion);
      const { error, status } = response.body;
      expect(response).to.have.status(401);
      expect(status).to.eql('fail');
      expect(error.message).to.eql('Access denied, Token required');
    });
    it('should prevent from accessing the question functionality with an invalid token', async () => {
      const response = await chai
        .request(app)
        .post(`${baseUrl}`)
        .send(newQuestion)
        .set('token', 'gyudfgufgiyegi3747');
      const { error, status } = response.body;
      expect(response).to.have.status(401);
      expect(status).to.eql('fail');
      expect(error.message).to.eql('Invalid Token');
    });
    it('should prevent a user from asking an invalid question (less than 6 characters long)', async () => {
      const response = await chai
        .request(app)
        .post(`${baseUrl}`)
        .send(invalidQuestion)
        .set('token', token);
      const { error, status } = response.body;
      expect(response).to.have.status(400);
      expect(status).to.eql('fail');
      expect(error.message).to.eql('A question should be atleast 6 characters long');
    });
    it('should return a 500 error response if something goes wrong while signin a user', async () => {
      const req = {
        body: {}
      };
      const res = sinonMockResponse(sinon);
      await create(req, res);
      expect(res.status).to.have.been.calledWith(500);
      expect(res.json).to.have.been.calledWith(errorResponse);
    });
  });
});

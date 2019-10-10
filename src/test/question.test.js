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
  errorResponse,
  mockRes
} from './dummy';

const { signup } = AuthController;
const { create, getQuestions, upVoteQuestion, downVoteQuestion } = QuestionController;

chai.use(chaiHttp);
chai.use(sinonChai);
describe('Question route endpoints', () => {
  const baseUrl = '/api/v1/question';
  let token;
  let questionId;
  before(async () => {
    const req = { body: { ...userAskingAQuestion } };

    const { data } = await signup(req, mockRes);
    const request = {
      body: {
        text: 'What is the yoruba way of writing a regular expression ?'
      },
      data: {
        id: data._id
      }
    };
    await create(request, mockRes);
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
      const { _id } = data;
      questionId = _id;
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
    it('should return a 500 error response if something goes wrong while creating a question', async () => {
      const req = {
        body: {}
      };
      const res = sinonMockResponse(sinon);
      await create(req, res);
      expect(res.status).to.have.been.calledWith(500);
      expect(res.json).to.have.been.calledWith(errorResponse);
    });
  });
  describe('GET /api/v1/question', () => {
    it('should allow a user to view all available questions successfully', async () => {
      const response = await chai
        .request(app)
        .get(`${baseUrl}`)
        .set('token', token);
      const { data, status } = response.body;
      expect(response).to.have.status(200);
      expect(status).to.eql('success');
      expect(data).to.be.an('array');
    });
    it('should allow a user to be able to set a limit for the number of questions he/she wants to view', async () => {
      const response = await chai
        .request(app)
        .get(`${baseUrl}?limit=1`)
        .set('token', token);
      const { data, status } = response.body;
      expect(response).to.have.status(200);
      expect(status).to.eql('success');
      expect(data.length).to.eql(1);
    });
    it('should allow a user to successfully paginate and limit questions he/she wants to view', async () => {
      const response = await chai
        .request(app)
        .get(`${baseUrl}?limit=1&page=2`)
        .set('token', token);
      const { data, status } = response.body;
      expect(response).to.have.status(200);
      expect(status).to.eql('success');
      expect(data.length).to.eql(1);
    });
    it('should return a 500 error response if something goes wrong while fetching questions', async () => {
      const req = {
        query: {
          limit: '-4',
          page: '2'
        }
      };
      const res = sinonMockResponse(sinon);
      await getQuestions(req, res);
      expect(res.status).to.have.been.calledWith(500);
      expect(res.json).to.have.been.calledWith(errorResponse);
    });
  });
  describe('GET /api/v1/question/:id', () => {
    it('should allow a user to successfully view a single question by its id', async () => {
      const response = await chai
        .request(app)
        .get(`${baseUrl}/${questionId}`)
        .set('token', token);
      const { data, status } = response.body;
      expect(response).to.have.status(200);
      expect(status).to.eql('success');
      expect(data.text).to.eql('What is it like to be a software Engineer?');
      expect(response.body.data.author).to.include(userAskingAQuestion);
    });
    it("should return a 404 error if a question with the id provided doesn't exist", async () => {
      const response = await chai
        .request(app)
        .get(`${baseUrl}/5d9e147c06a21a2180dfb976`)
        .set('token', token);
      const { error, status } = response.body;
      expect(response).to.have.status(404);
      expect(status).to.eql('fail');
      expect(error.message).to.eql('A question with the id provided was not found');
    });
    it('should return an error message if a user provides an invalid question id to the path', async () => {
      const response = await chai
        .request(app)
        .get(`${baseUrl}/5`)
        .set('token', token);
      const { error, status } = response.body;
      expect(response).to.have.status(400);
      expect(status).to.eql('fail');
      expect(error.message).to.eql('Invalid question Id');
    });
  });
  describe('PATCH /api/v1/question/upvote/:id', () => {
    it('should allow an authenticated user to upvote a question', async () => {
      const response = await chai
        .request(app)
        .patch(`${baseUrl}/upvote/${questionId}`)
        .set('token', token);
      const { data, status } = response.body;
      expect(response).to.have.status(200);
      expect(status).to.eql('success');
      expect(data.upVote.by[0]).to.include(userAskingAQuestion);
      expect(data.upVote.total).to.eql(1);
    });
    it("should remove the 1 upvote from the total of a question's upvotes whenever a user attempts to upvotes a second for a second time", async () => {
      const response = await chai
        .request(app)
        .patch(`${baseUrl}/upvote/${questionId}`)
        .set('token', token);
      const { data, status } = response.body;
      expect(response).to.have.status(200);
      expect(status).to.eql('success');
      expect(data.upVote.by.length).to.eql(0);
      expect(data.upVote.total).to.eql(0);
    });
    it('should remove the 1 downvote from the total of a question and add 1 upvote to it whenever a user who previously downvoted a question make a request to upvote it', async () => {
      const res = await chai
        .request(app)
        .patch(`${baseUrl}/downvote/${questionId}`)
        .set('token', token);
      expect(res.body.data.downVote.total).to.eql(1);
      const response = await chai
        .request(app)
        .patch(`${baseUrl}/upvote/${questionId}`)
        .set('token', token);
      const { data, status } = response.body;
      expect(response).to.have.status(200);
      expect(status).to.eql('success');
      expect(data.upVote.by.length).to.eql(1);
      expect(data.upVote.total).to.eql(1);
      expect(data.downVote.total).to.eql(0);
    });
    it('should prevent an unautheticated user from upvoting a question', async () => {
      const response = await chai.request(app).patch(`${baseUrl}/upvote/${questionId}`);
      const { error, status } = response.body;
      expect(response).to.have.status(401);
      expect(status).to.eql('fail');
      expect(error.message).to.eql('Access denied, Token required');
    });
    it("should return a 404 error if a question with the id provided doesn't exist", async () => {
      const response = await chai
        .request(app)
        .patch(`${baseUrl}/upvote/5d9e147c06a21a2180dfb976`)
        .set('token', token);
      const { error, status } = response.body;
      expect(response).to.have.status(404);
      expect(status).to.eql('fail');
      expect(error.message).to.eql('A question with the id provided was not found');
    });
    it('should return an error message if a user provides an invalid question id to the path', async () => {
      const response = await chai
        .request(app)
        .patch(`${baseUrl}/upvote/5`)
        .set('token', token);
      const { error, status } = response.body;
      expect(response).to.have.status(400);
      expect(status).to.eql('fail');
      expect(error.message).to.eql('Invalid question Id');
    });
    it('should return a 500 error response if something goes wrong while upvoting questions', async () => {
      const req = {};
      const res = sinonMockResponse(sinon);
      await upVoteQuestion(req, res);
      expect(res.status).to.have.been.calledWith(500);
      expect(res.json).to.have.been.calledWith(errorResponse);
    });
  });
  describe('PATCH /api/v1/question/downvote/:id', () => {
    it('should allow an authenticated user to downvote a question', async () => {
      const response = await chai
        .request(app)
        .patch(`${baseUrl}/downvote/${questionId}`)
        .set('token', token);
      const { data, status } = response.body;
      expect(response).to.have.status(200);
      expect(status).to.eql('success');
      expect(data.downVote.by[0]).to.include(userAskingAQuestion);
      expect(data.downVote.total).to.eql(1);
      expect(data.upVote.total).to.eql(0);
    });
    it("should remove 1 downvote from the total of a question's  downvote whenever a user attempts to downvote a question for a second time", async () => {
      const response = await chai
        .request(app)
        .patch(`${baseUrl}/downvote/${questionId}`)
        .set('token', token);
      const { data, status } = response.body;
      expect(response).to.have.status(200);
      expect(status).to.eql('success');
      expect(data.downVote.by.length).to.eql(0);
      expect(data.downVote.total).to.eql(0);
    });
    it('should remove the 1 upvote from the total of a question and add 1 downvote to it whenever a user who previously upvoted a question make a request to downvote it', async () => {
      const res = await chai
        .request(app)
        .patch(`${baseUrl}/upvote/${questionId}`)
        .set('token', token);
      expect(res.body.data.upVote.total).to.eql(1);
      const response = await chai
        .request(app)
        .patch(`${baseUrl}/downvote/${questionId}`)
        .set('token', token);
      const { data, status } = response.body;
      expect(response).to.have.status(200);
      expect(status).to.eql('success');
      expect(data.downVote.by.length).to.eql(1);
      expect(data.downVote.total).to.eql(1);
      expect(data.upVote.total).to.eql(0);
    });
    it('should prevent an unautheticated user from downvoting a question', async () => {
      const response = await chai.request(app).patch(`${baseUrl}/downvote/${questionId}`);
      const { error, status } = response.body;
      expect(response).to.have.status(401);
      expect(status).to.eql('fail');
      expect(error.message).to.eql('Access denied, Token required');
    });
    it("should return a 404 error if a question with the id provided doesn't exist", async () => {
      const response = await chai
        .request(app)
        .patch(`${baseUrl}/downvote/5d9e147c06a21a2180dfb976`)
        .set('token', token);
      const { error, status } = response.body;
      expect(response).to.have.status(404);
      expect(status).to.eql('fail');
      expect(error.message).to.eql('A question with the id provided was not found');
    });
    it('should return an error message if a user provides an invalid question id to the path', async () => {
      const response = await chai
        .request(app)
        .patch(`${baseUrl}/downvote/5`)
        .set('token', token);
      const { error, status } = response.body;
      expect(response).to.have.status(400);
      expect(status).to.eql('fail');
      expect(error.message).to.eql('Invalid question Id');
    });
    it('should return a 500 error response if something goes wrong while downvoting questions', async () => {
      const req = {};
      const res = sinonMockResponse(sinon);
      await downVoteQuestion(req, res);
      expect(res.status).to.have.been.calledWith(500);
      expect(res.json).to.have.been.calledWith(errorResponse);
    });
  });
});

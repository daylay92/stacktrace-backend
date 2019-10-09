import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import app from '..';
import { AuthController } from '../controllers';
import {
  newUser,
  invalidUserData,
  errorResponse,
  sinonMockResponse,
  existingUser
} from './dummy';
import Helpers from '../utils';

const { signup, signin } = AuthController;

chai.use(chaiHttp);
chai.use(sinonChai);

describe('Auth route endpoints', () => {
  const baseUrl = '/api/v1/auth';
  afterEach(() => {
    if (sinon.restore) sinon.restore();
  });
  describe('POST /api/v1/auth/signup', () => {
    it('should signup a user successfully if valid input parameters are provided', async () => {
      const response = await chai
        .request(app)
        .post(`${baseUrl}/signup`)
        .send(newUser);
      const { data, status } = response.body;
      delete newUser.password;
      expect(response).to.have.status(201);
      expect(status).to.eql('success');
      expect(data.token).to.be.a('string');
      expect(response.body.data).to.include(newUser);
    });
    it('should prevent a user from registering with an existing email address', async () => {
      newUser.password = 'werirui1';
      const response = await chai
        .request(app)
        .post(`${baseUrl}/signup`)
        .send(newUser);
      const { error, status } = response.body;
      expect(response).to.have.status(409);
      expect(status).to.eql('fail');
      expect(error.message).to.eql('A user with your email already exists');
    });
    it('should return an error response if user tries to register with invalid parameters', async () => {
      const response = await chai
        .request(app)
        .post(`${baseUrl}/signup`)
        .send(invalidUserData);
      const { error, status } = response.body;
      expect(response).to.have.status(400);
      expect(status).to.eql('fail');
      expect(error.message).to.eql('A valid email address is required');
    });
    it('should return a 500 error response if something goes wrong while registering a user', async () => {
      const req = {
        body: { ...newUser, email: 'kinga@hotmail.com' }
      };
      const res = sinonMockResponse(sinon);
      sinon.stub(Helpers, 'generateToken').throws();
      await signup(req, res);
      expect(res.status).to.have.been.calledWith(500);
      expect(res.json).to.have.been.calledWith(errorResponse);
    });
  });
  describe('POST /api/v1/auth/signin', () => {
    it('should enable a user to successfully login with valid credentials', async () => {
      delete newUser.password;
      const response = await chai
        .request(app)
        .post(`${baseUrl}/signin`)
        .send(existingUser);
      const { data, status } = response.body;
      expect(response).to.have.status(200);
      expect(status).to.eql('success');
      expect(data.token).to.be.a('string');
      expect(response.body.data).to.include(newUser);
    });
    it('should prevent a user from signing in without providing any of the required login credentials', async () => {
      const response = await chai
        .request(app)
        .post(`${baseUrl}/signin`)
        .send({ email: 'daylaayaoi@yahoo.com' });
      const { error, status } = response.body;
      expect(response).to.have.status(401);
      expect(status).to.eql('fail');
      expect(error.message).to.eql('Invalid email/password');
    });
    it('should prevent a user from signing in with an incorrect password', async () => {
      const response = await chai
        .request(app)
        .post(`${baseUrl}/signin`)
        .send({ ...existingUser, password: 'iriroko2' });
      const { error, status } = response.body;
      expect(response).to.have.status(401);
      expect(status).to.eql('fail');
      expect(error.message).to.eql('Invalid email/password');
    });
    it('should prevent a user from signing in with an unregistered email address', async () => {
      const response = await chai
        .request(app)
        .post(`${baseUrl}/signin`)
        .send({ ...existingUser, email: 'signs@yahoo.com' });
      const { error, status } = response.body;
      expect(response).to.have.status(401);
      expect(status).to.eql('fail');
      expect(error.message).to.eql('Invalid email/password');
    });
    it('should return a 500 error response if something goes wrong while signin a user', async () => {
      const req = {
        body: { ...existingUser }
      };
      const res = sinonMockResponse(sinon);
      sinon.stub(Helpers, 'generateToken').throws();
      await signin(req, res);
      expect(res.status).to.have.been.calledWith(500);
      expect(res.json).to.have.been.calledWith(errorResponse);
    });
  });
});

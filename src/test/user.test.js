import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '..';
import { mockRes, someNewDude } from './dummy';
import { AuthController } from '../controllers';

const { signup } = AuthController;
chai.use(chaiHttp);

describe('User route Endpoints', () => {
  const baseUrl = '/api/v1/user';
  let userId;
  before(async () => {
    const req = { body: { ...someNewDude } };

    const { data } = await signup(req, mockRes);
    userId = data._id;
  });
  describe('GET /api/v1/user', () => {
    it('it should retrieve all users with the max number of records set at 30', async () => {
      const response = await chai.request(app).get(`${baseUrl}`);
      const { data, status } = response.body;
      expect(response).to.have.status(200);
      expect(status).to.eql('success');
      expect(data.length).to.be.at.most(30);
      expect(data.length).to.be.at.least(1);
    });
    it('should enable users to search for a user by firstname', async () => {
      const response = await chai.request(app).get(`${baseUrl}?name=ayo`);
      const { data, status } = response.body;
      expect(response).to.have.status(200);
      expect(status).to.eql('success');
      expect(data.length).to.eql(3);
    });
    it('should enable users to search for a user by fullname', async () => {
      const response = await chai.request(app).get(`${baseUrl}?name=ayodele Aki`);
      const { data, status } = response.body;
      expect(response).to.have.status(200);
      expect(status).to.eql('success');
      expect(data.length).to.eql(1);
    });
    it('should allow users to search for users by a generic property using key and value as query parameters', async () => {
      const response = await chai
        .request(app)
        .get(`${baseUrl}?key=email&value=daylay10@yahoo.com`);
      const { data, status } = response.body;
      expect(response).to.have.status(200);
      expect(status).to.eql('success');
      expect(data.length).to.eql(1);
    });
    it('it should ignore the password field if it is set as a query parameter', async () => {
      const response = await chai
        .request(app)
        .get(`${baseUrl}?value=ayodele&key=password`);
      const { data, status } = response.body;
      expect(response).to.have.status(200);
      expect(status).to.eql('success');
      expect(data.length).to.eql(4);
    });
  });
  describe('GET api/v1/user/:userId', () => {
    it('should allow users to fetch a single user by his/her id', async () => {
      const response = await chai.request(app).get(`${baseUrl}/${userId}`);
      const { data, status } = response.body;
      expect(response).to.have.status(200);
      expect(status).to.eql('success');
      delete someNewDude.password;
      expect(data).to.include(someNewDude);
    });
    it("should return a 404 error if a user with the id specified doesn't exist", async () => {
      const response = await chai.request(app).get(`${baseUrl}/5d9e147c06a21a2180dfb976`);
      const { error, status } = response.body;
      expect(response).to.have.status(404);
      expect(status).to.eql('fail');
      expect(error.message).to.eql('A user with the id provided was not found');
    });
    it('should return an error message if the route path contains an invalid id variable', async () => {
      const response = await chai.request(app).get(`${baseUrl}/5`);
      const { error, status } = response.body;
      expect(response).to.have.status(400);
      expect(status).to.eql('fail');
      expect(error.message).to.eql('Invalid user Id');
    });
  });
});

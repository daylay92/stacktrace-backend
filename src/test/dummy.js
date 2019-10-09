export const newUser = {
  firstName: 'Ayo',
  lastName: 'Akin',
  email: 'daylay10@yahoo.com',
  password: 'daylayayo1'
};
export const invalidUserData = {
  firstName: 'Ayo',
  lastName: 'Akin',
  email: 'daylay10yahoo.com',
  password: 'daylayayo1'
};
export const existingUser = {
  email: 'daylay10@yahoo.com',
  password: 'daylayayo1'
};
export const sinonMockResponse = sinon => {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
};

export const errorResponse = {
  status: 'fail',
  error: {
    message: 'Some error occurred, try again',
    errors: undefined
  }
};
export const userAskingAQuestion = {
  firstName: 'Ayodq',
  lastName: 'Akinb',
  email: 'daylayzi@yahoo.com',
  password: 'daylayayo1'
};
export const newQuestion = {
  text: 'What is it like to be a software Engineer?'
};

export const invalidQuestion = {
  text: 'Why?'
};

import swaggerUI from 'swagger-ui-express';
import authRoutes from './v1/auth';
import apiDocs from '../../swagger.json';

const routes = app => {
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(apiDocs));
};

export default routes;

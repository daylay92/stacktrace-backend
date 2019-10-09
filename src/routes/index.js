import swaggerUI from 'swagger-ui-express';
import apiDocs from '../../swagger.json';
import authRoutes from './v1/auth';
import questionRoutes from './v1/question';

const routes = app => {
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/question', questionRoutes);
  app.use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(apiDocs));
};

export default routes;

import authRoutes from './v1/auth';

const routes = app => {
  app.use('/api/v1/auth', authRoutes);
};

export default routes;

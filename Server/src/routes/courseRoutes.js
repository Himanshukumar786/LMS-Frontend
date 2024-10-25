import { Router } from 'express';

const routes = Router();

routes.get('/', getallCourses);
routes.get('/:id', getLecturesByCourseId);

export default routes;
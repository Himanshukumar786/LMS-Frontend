import { Router } from 'express';
import { createCourse, getAllCourses, getLecturesByCourseId, removeCourse, updateCourse } from '../controllers/courseController.js';
import isLoggedIn from '../middlewares/authMiddleware.js';
import upload from '../middlewares/multerMiddleware.js';

const router = Router();

router.route('/')
    .get(getAllCourses)
    .post(
        upload.single('thumbnail'),
        createCourse
    )

router.route('/:id')
    .get(isLoggedIn, getLecturesByCourseId)
    .put(updateCourse)
    .delete(removeCourse);

export default router;
import Course from "../models/courseModel.js";
import AppError from "../utils/errorUtil.js";

const getAllCourses = async function(req, res, next) {

    try {
        const courses = await Course.find({}).select('-lectures');

        res.status(200).json({
            status: 'success',
            message: 'All courses',
            courses
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

const getLecturesByCourseId = async function(req, res, next) {
    try {
        const { id } = req.params;

        const course = await Course.findById(id);

        if (!course) {
            return next(new AppError('Course not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Course lectures fetched successfully',
            lectures: course.lectures
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

export { getAllCourses, getLecturesByCourseId };
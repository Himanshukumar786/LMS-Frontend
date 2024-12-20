import Course from "../models/courseModel.js";
import AppError from "../utils/errorUtil.js";
import fs from 'fs/promises';
import cloudinary from 'cloudinary';

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

const createCourse = async function(req, res, next) {
    const { title, description, category, createdBy } = req.body;

    if (!title || !description || !category || !createdBy) {
        return next(new AppError('Please provide all the required fields', 400));
    }

    const course = await Course.create({
        title,
        description,
        category,
        createdBy,
        thumbnail: {
            public_id: 'Dummy',
            secure_url: 'Dummy',
        },
    });

    if (!course) {
        return next(new AppError('Course could not created, please try again', 500));
    }

    if (req.file) {

        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms'
            });
            console.log(JSON.stringify('Result: ', result));
            if (result) {
                course.thumbnail.public_id = result.public_id;
                course.thumbnail.secure_url = result.secure_url;
            }
    
            fs.rm(`uploads/${req.file.filename}`);
        } catch (error) {
            return next(new AppError(error.message, 500));
        }
    }

    await course.save();

    res.status(201).json({
        success: true,
        message: 'Course created successfully',
        course
    });
}

const updateCourse = async function(req, res, next) {
    try {
        const { id } = req.params;
        const course = await Course.findByIdAndUpdate(
            id,
            {
                $set: req.body
            },
            {
                runValidators: true,
            }
        );

        if (!course) {
            return next(new AppError('Course with given id does not exist', 500));
        }

        res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            course
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

const removeCourse = async function(req, res, next) {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);

        if (!course) {
            return next(new AppError('Course with given id does not exist', 500));
        }

        await Course.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Course deleted successfully',
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

const addLectureToCourseById = async function(req, res, next) {

    try {

        const { title, description } = req.body;
        const { id } = req.params;

        if (!title || !description) {
            return next(new AppError('All fields are required', 400));
        }

        const course = await Course.findById(id);

        if (!course) {
            return next(new AppError('Course with given id does not exist', 500));
        }

        const lectureData = {
            title,
            description,
            lecture: {}
        };

        if (req.file) {
            try {

                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: 'lms'
                });

                if (result) {
                    lectureData.lecture.public_id = result.public_id;
                    lectureData.lecture.secure_url = result.secure_url;
                }
        
                fs.rm(`uploads/${req.file.filename}`);
            } catch (error) {
                return next(new AppError(error.message, 500));
            }
        }

        console.log('Lecture Data: ', JSON.stringify(lectureData));
        course.lectures.push(lectureData);

        course.numberOfLectures = course.lectures.length;

        await course.save();

        res.status(200).json({
            success: true,
            message: 'Lecture added to course successfully',
            course
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

export { getAllCourses, getLecturesByCourseId, createCourse, updateCourse, removeCourse, addLectureToCourseById };
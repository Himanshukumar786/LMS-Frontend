import User from "../models/userModel.js";
import AppError from "../utils/errorUtil.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises';
import sendEmail from "../utils/sendEmail.js";

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: true,
}

const register = async (req, res, next) => {
    const { fullName, email, password} = req.body;

    if(!fullName || !email || !password) {
        return new next(AppError('All fields are required', 400));
    }

    const userExists = await User.findOne({ email });

    if(userExists) {
        return next(new AppError('Email already exists', 400));
    }

    const user = await User.create({
        fullName,
        email,
        password,
        avatar: {
            public_id: email,
            secure_url: 'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
        }
    });

    if (!user) {
        return next(new AppError('User registration failed, please try again', 400));
    }

    // TODO: File upload to cloudinary
    console.log('file details -> ',JSON.stringify(req.file));
    if (req.file) {
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms',
                width: 250,
                height: 250,
                gravity: 'faces',
                crop: 'fill',
            });

            if (result) {
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url

                // Delete the file from the server
                fs.rm(`uploads/${req.file.filename}`)
            }
        } catch (error) {
            return next(new AppError('File not uploaded, please try again', 500));
        }
    }

    await user.save();

    user.password = undefined;

    const token = await user.generateJWTToken();

    res.cookie('token', token, cookieOptions);

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user,
    });
}

const login = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('All fields are required', 400));
        }

        const user = await User.findOne({ 
            email 
        }).select('+password');

        if (!user || !user.comparePassword(password)) {
            return next(new AppError('Email or password does not match', 400));
        };

        const token = await user.generateJWTToken();
        user.password = undefined;

        res.cookie('token', token, cookieOptions);

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            user,
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

const logout = (req, res) => {
    res.cookie('token', null, {
        secure: true,
        maxAge: 0,
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: 'User logged out successfully',
    });
}

const getProfile = async (req, res) => {

    try {
        const userId = req.body.id;
        const user = await User.findById(userId);

        res.status(200).json({
            success: true,
            message: 'User details',
            user,
        });
    } catch (error) {
        return next(new AppError('Failed to fetch profile detail', 500));
    }
}

const forgotPassword = async (req, res, next) => {
    console.log('forgotPassword -> ', req.body);
    const { email } = req.body;

    if (!email) {
        return next(new AppError('Email is required', 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
        return next(new AppError('Email not registered', 400));
    }

    const resetToken = await user.generateResetPasswordToken();

    await user.save();

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    console.log('resetPasswordUrl -> ', resetPasswordUrl);

    // We here need to send an email to the user with the token
    const subject = 'Reset Password';
    const message = `You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${resetPasswordUrl}.\n If you have not requested this, kindly ignore.`;

    try {
        // Send email with reset password link
        await sendEmail(email, subject, message);

        res.status(200).json({
            success: true,
            message: `Reset password token has been sent to ${email} successfully`,
        });
    } catch (error) {

        user.forgetPasswordToken = undefined;
        user.forgetPasswordExpire = undefined;

        await user.save();

        return next(new AppError(error.message, 500));
    }
}

const resetPassword = async (req, res) => {
    const { resetToken } = req.params;

}

export { register, login, logout, getProfile, forgotPassword, resetPassword };
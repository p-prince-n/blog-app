import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return next(errorHandler(400, 'All fields are required'));
        }

        if (password.length < 6) {
            return next(errorHandler(400, 'Password should contain at least 6 characters.'));
        }

        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return next(errorHandler(400, 'Username or email already taken.'));
        }

        const hashPass = await bcryptjs.hash(password, 10);
        const newUser = new User({ username, email, password: hashPass });
        await newUser.save();

        // Optionally remove password from response
        const { password: _, ...userWithoutPass } = newUser._doc;

        res.status(201).json(userWithoutPass);

    } catch (e) {
        next(errorHandler(500, e.message));
    }
};

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(errorHandler(400, 'All fields are required'));
        }

        const isUser = await User.findOne({ email });

        if (!isUser) {
            return next(errorHandler(404, 'User with this email doesn\'t exist.'));
        }

        const isValid = await bcryptjs.compare(password, isUser.password);

        if (!isValid) {
            return next(errorHandler(400, 'Incorrect password'));
        }

        const token = jwt.sign(
            { id: isUser._id, isAdmin: isUser.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        const { password: _, ...userWithoutPass } = isUser._doc;

        res.status(200)
            .cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            })
            .json(userWithoutPass);

    } catch (e) {
        next(errorHandler(500, e.message));
    }
};

export const google = async (req, res, next) => {
    const { name, email, googlePhotoUrl } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign(
                { id: user._id, isAdmin: user.isAdmin },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            const { password: _, ...userWithoutPass } = user._doc;

            res.status(200)
                .cookie('access_token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'None',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                })
                .json(userWithoutPass);
        }else{
            const generatedPassword=Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hasPass= await bcryptjs.hash(generatedPassword, 10);
            const newUser= new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4) ,
                email,
                password: hasPass,
                profilePic:googlePhotoUrl
            });
            await newUser.save();
            const token = jwt.sign(
                { id: newUser._id, isAdmin: newUser.isAdmin },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
    
            const { password: _, ...userWithoutPass } = newUser._doc;
    
            res.status(200)
                .cookie('access_token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'None',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                })
                .json(userWithoutPass);
        }

    } catch (e) {
        next(errorHandler(500, e.message));
    }
}

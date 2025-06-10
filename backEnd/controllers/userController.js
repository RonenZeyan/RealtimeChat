import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

/**
 * @description Register New User
 * @router /api/auth/register
 * @method POST
 * @access public
 */
export const register = async (req, res) => {
    const { fullName, email, password, bio } = req.body;
    try {

        //in case data missing
        if (!fullName || !email || !password || !bio) {
            return res.status(400).json({ success: false, message: "Missing Data" });
        }

        //check if user exist
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: "User Already Exist" });
        }

        //generate hashed Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create and save new user in db 
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio,
        });

        const token = generateToken(newUser._id);

        res.status(201).json({ success: true, newUser, token, message: "Account Created Successfully." });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}


/**
 * @description Login User
 * @router /api/auth/login
 * @method POST
 * @access public
 */
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        //fetch user by email(email unique)
        const user_data = await User.findOne({ email });

        //if user not found
        if (!user_data || !(await bcrypt.compare(password, user_data.password))) {
            return res.status(400).json({ success: false, message: "Email or Password Invalid" })
        }

        const token = generateToken(newUser._id);
        res.status(201).json({ success: true, user_data, token, message: "Account logged in Successfully." });


    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}


/**
 * @description check if user authenticated
 * @router /api/auth/authenticate
 * @method GET
 * @access public
 */
export const checkAuth = (req, res) => {
    res.status(200).json({ success: true, user: req.user });
}

/**
 * @description Update User Profile 
 * @router /api/auth/profile/:id
 * @method PUT
 * @access (only user himself)
 */
export const updateProfile = async (req, res) => {

    const { profilePic, bio, fullName } = req.body;
    const user_id = req.user._id;
    let updatedUser;

    try {
        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(user_id, { bio, fullName }, { new: true });
        } else {
            const uploadPic = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(user_id, { profilePic: uploadPic.secure_url, bio, fullName }, { new: true })
        }

        res.status(200).json({ success: true, updatedUser })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message })

    }
}
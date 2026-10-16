import userData from '../model/user.js';
import bcrypt from 'bcrypt';
import generateToken from '../utils/jwtutils.js';
import cloudinary from '../config/cloudinary.js';

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'msc.it_user' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(buffer);
    });
};

export const addUser = async (req, res) => {
    try {
        const password = await bcrypt.hash(req.body.password, 10);
        let imageUrl = '';

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            imageUrl = result.secure_url;
        }

        const userDataval = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            password,
            image: imageUrl
        };

        const saveUserData = await userData.create(userDataval);

        res.status(200).json({
            message: 'User added successfully',
            data: saveUserData
        });
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const getuserData = await userData.find();

        res.status(200).json({
            message: 'Users fetched successfully',
            data: getuserData
        });
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

export const getSingleUser = async (req, res) => {
    try {
        const id = req.params.uid;
        const getsingleUserdata = await userData.findById(id);

        if (!getsingleUserdata) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User fetched successfully',
            data: getsingleUserdata
        });
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const id = req.params.uid;
        const deleteuserData = await userData.findByIdAndDelete(id);

        if (!deleteuserData) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User deleted successfully',
            data: deleteuserData
        });
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const uData = await userData.findOne({
            email: req.body.email
        });

        if (!uData) {
            return res.status(401).json({
                message: 'User not found',
                status: 0
            });
        }

        const comparepass = await bcrypt.compare(
            req.body.password,
            uData.password
        );

        if (!comparepass) {
            return res.status(401).json({
                message: 'Password does not match',
                status: 0
            });
        }

        const token = await generateToken(uData);

        return res.status(200).json({
            message: 'Login successful',
            status: 1,
            data: uData,
            token
        });
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};
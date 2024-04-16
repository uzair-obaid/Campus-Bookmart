// auth.js
const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secretKey = "thisisnotgood"; 

const generateToken = async (userId) => {
    return jwt.sign({ userId }, secretKey);
};

const auth = {
    signup: async (req, res) => {
        try {
            const { email, username, password } = req.body;
            
            let existingUsermail = await User.findOne({ email });
            if (existingUsermail) {
                return res.status(400).json({ message: 'User already exists' });
            }
            let existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const newUser = new User({
                email,
                username,
                password: hashedPassword,
                isAdmin:false
            });
            await newUser.save();
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            
            res.status(500).json({ message: 'Server error' });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            
            if(user.isAdmin){
                const adminAppUrl = 'http://localhost:3001';
                res.status(201).redirect(adminAppUrl);
            }
            else{
            const token = await generateToken(user._id);
            res.status(201).json({ token });
            }
        } catch (error) {
            
            res.status(500).json({ message: 'Server error' });
        }
    }
};

module.exports = { auth, secretKey };

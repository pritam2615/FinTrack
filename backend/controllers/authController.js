const User = require("../models/authModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../config/utils");

exports.signup = async (req, res) => {
    const { userName, email, password } = req.body;
    try {
        if (!userName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already exist" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            userName,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const token = generateToken(newUser._id, res);

        return res.status(201).json({
            _id: newUser._id,
            userName: newUser.userName,
            email: newUser.email,
            token,
        });
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password)
            return res.status(400).json({ message: "All fields are required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

       const token = generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            userName: user.userName,
            email: user.email,
        });

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

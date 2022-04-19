"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        minLength: 7,
        maxLength: 20,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        maxLength: 40,
        trim: true,
        unique: true,
        lowercase: true,
        validate: (value) => {
            if (!validator_1.default.isEmail(value))
                throw new Error('Invalid Email address');
        },
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
    },
    replays: [mongoose_1.Types.ObjectId],
    tokens: [String],
});
// Hash the password before saving the user model
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password'))
        user.password = await bcrypt.hash(user.password, 8);
    next();
});
// Generate an auth token for the user, unique to the login from their current device
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    console.log('Generating with secret: ' + process.env.JWT_SECRET);
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    user.tokens.push(token);
    await user.save();
    return token;
};
// Search for a user by email and password
userSchema.statics.findByCredentials = async function (email, password) {
    const user = await User.findOne({ email });
    if (!user)
        throw new Error('Could not find the given email');
    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect)
        throw new Error('Incorrect password for given email');
    return user;
};
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;

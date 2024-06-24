
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const transporter = require('../config/nodemailer');
const secretKey = process.env.JWT_SECRET;

let blacklistedTokens = [];

// Function to generate a token based on email ID
function generateToken(email) {
    const token = jwt.sign({ email }, secretKey, { expiresIn: '24h' });
    return token;
}

function generateResetToken(email) {
    const resetToken = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
    return resetToken
}


// Signup endpoint with token verification
exports.signup = (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if (email == "" || password == "") {
        return res.status(400).json({
            status: "Failed",
            message: "Empty input fields"
        });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
            status: "Failed",
            message: "Invalid email format"
        });
    } else if (password.length < 8) {
        return res.status(400).json({
            status: "Failed",
            message: "Password is too short"
        });
    }

    User.findOne({ email })
        .then(existingUser => {
            if (existingUser) {
                return res.status(400).json({
                    status: "Failed",
                    message: "User with this email already exists"
                });
            }

            // Generate a verification token (valid for 24 hours)
            const verificationToken = jwt.sign({ email }, secretKey, { expiresIn: '24h' });

            // Send email with verification token
            const mailOptions = {
                from: 'ankitkalra13@gmail.com',
                to: email,
                subject: 'Email Verification',
                text: `Please click on the following link to verify your email: http://localhost:3000/verify/${verificationToken}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({
                        status: "Failed",
                        message: "Failed to send verification email"
                    });
                }

                // Hash password and create new user
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds)
                    .then(hashedPassword => {
                        const newUser = new User({
                            email,
                            password: hashedPassword,
                            status: "Verification Pending"
                        });

                        return newUser.save();
                    })
                    .then(result => {
                        res.json({
                            status: "Success",
                            message: "Sign up successful. Verification email sent."
                        });
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).json({
                            status: "Failed",
                            message: "Failed to create an account. Please try again later."
                        });
                    });
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                status: "Failed",
                message: "An error occurred while processing your request"
            });
        });
};


// Signin endpoint
exports.signin =  (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if (email == "" || password == "") {
        return res.status(400).json({
            status: "Failed",
            message: "Empty credentials"
        });
    }

    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    status: "Failed",
                    message: "User not found"
                });
            }

            bcrypt.compare(password, user.password)
                .then(match => {
                    if (match) {
                        const token = generateToken(email); // Generate token upon successful signin
                        res.json({
                            status: "Success",
                            message: "Sign in successful",
                            token, // Send token back to client
                            data: user
                        });
                    } else {
                        res.status(401).json({
                            status: "Failed",
                            message: "Incorrect password"
                        });
                    }
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).json({
                        status: "Failed",
                        message: "An error occurred while comparing passwords"
                    });
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                status: "Failed",
                message: "An error occurred while checking if user exists"
            });
        });
};


// Forget Password endpoint with Nodemailer integration
exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    if (!email || email.trim() === "") {
        return res.status(400).json({
            status: "Failed",
            message: "Email is required"
        });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                status: "Failed",
                message: "User not found"
            });
        }

        const resetToken = generateResetToken(email);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Token',
            text: `Please click on the following link to reset your password: http://localhost:3000/reset-password/${resetToken}. It is valid for 1 hour.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    status: "Failed",
                    message: "Failed to send password reset email"
                });
            }

            res.json({
                status: "Success",
                message: "Password reset token sent to your email"
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Failed",
            message: "An error occurred while processing your request"
        });
    }
};

exports.resetPassword = async (req, res) => {
    const { token, password } = req.body;
    if (!token || !password) {
        return res.status(400).json({
            status: "Failed",
            message: "Token and new password are required"
        });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        const { email } = decoded;

        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                status: "Failed",
                message: "User not found"
            });
        }

        res.json({
            status: "Success",
            message: "Password has been reset successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(401).json({
            status: "Failed",
            message: "Invalid or expired token"
        });
    }
};


// Verify JWT token and update user status endpoint
exports.verifyEmailToken = (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({
            status: "Failed",
            message: "Token is required"
        });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        const { email } = decoded;

        // Update user status to "Verified"
        User.findOneAndUpdate({ email }, { $set: { status: "Verified" } }, { new: true })
            .then(updatedUser => {
                if (!updatedUser) {
                    return res.status(404).json({
                        status: "Failed",
                        message: "User not found"
                    });
                }

                res.json({
                    status: "Success",
                    message: "User status updated to Verified",
                    data: updatedUser
                });
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({
                    status: "Failed",
                    message: "An error occurred while updating user status"
                });
            });

    } catch (err) {
        console.error(err);
        res.status(401).json({
            status: "Failed",
            message: "Invalid or expired token"
        });
    }
};

exports.verifyHeaderToken = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    if (isTokenBlacklisted(token)) {
        return res.status(401).json({ status: "Failed", message: "Token is invalid" });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
        return res.status(401).json({ status: "Failed", message: "Token is invalid" });
        }
        req.user = decoded;
        res.status(200).json({
            status: "Success",
            message: "Valid token"
        });
    });
}

exports.logout = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
  
    // Add the token to the blacklist
    blacklistedTokens.push(token);
    console.log(blacklistedTokens);
  
    res.status(200).json({
      status: "Success",
      message: "Logged out successfully"
    });
  }
  
  // Middleware to check if token is blacklisted
  function isTokenBlacklisted(token) {
    return blacklistedTokens.includes(token);
  }
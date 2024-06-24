const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UserSchema = new schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, default: 'Verification Pending' }
})

const User = mongoose.model('User', UserSchema);

module.exports = User;


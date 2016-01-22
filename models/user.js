var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt-nodejs'),
    jwtUtils = require('../utils/jwt'),
    Schema = mongoose.Schema;

var UserSchema   = new Schema({
    username: { type: String, unique: true, required: true },
    email   : { type: String, unique: true, required: true },
    password: { type: String, required: true },
    token   : { type: String }
});


function generateHash (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.pre('save', function (next) {
    this.password = generateHash(this.password);
    this.token = jwtUtils.generateToken({ _id: this._id, email: this.email });
    next();
});

module.exports = mongoose.model('User', UserSchema);

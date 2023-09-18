const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
      },
    password: String,
    role: {
        type: String,
        default: "visitor"
    },
    projects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'projects',
        }
    ]
},{timestamps: true})

const UserModel = mongoose.model("utilisateurs", UserSchema)
module.exports = UserModel
const mongoose = require("mongoose");

const accountSchema = mongoose.Schema(
    {
        pseudo: {
            type: String,
            required: true,
        },
        mail: {
            type: String,
            required: true
        },
        mdp: {
            type: String,
            required: true
        },
        tournaments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tournaments' 
        }],
        birthday: {
            type: Date
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Auth', accountSchema);
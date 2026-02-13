const mongoose = require("mongoose")

const playerSchema = mongoose.Schema(
    {
        pseudo: {
            type: String,
            required: true
        },
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'teams'
        }
    },
    {
        timestamps: true,
    }
);


module.exports = mongoose.model('players',playerSchema);
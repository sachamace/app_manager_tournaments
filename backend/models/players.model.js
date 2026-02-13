const mongoose = require("mongoose")

const playerSchema = mongoose.Schema(
    {
        pseudo: {
            type: String,
            required: true
        },
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teams'
        }
    },
    {
        timestamps: true,
    }
);


module.exports = mongoose.model('Players',playerSchema);
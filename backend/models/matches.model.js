const mongoose = require("mongoose")

const matchesSchema = mongoose.Schema(
    {
        tournament: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tournaments',
            required: true
        },
        teams: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Teams' 
            }],
            validate: [(val) => val.length <= 2, 'Un match ne peut avoir que 2 équipes maximum']
        },
        winner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teams'
        },
        loser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teams'
        },
        score: [{
            team: { type: mongoose.Schema.Types.ObjectId, ref: 'Teams' },
            points: Number
        }]
    },
    {
        timestamps: true,
    }
);


module.exports = mongoose.model('matches',matchesSchema);
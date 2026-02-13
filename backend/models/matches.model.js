const mongoose = require("mongoose")

const matchesSchema = mongoose.Schema(
    {
        tournament: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tournaments',
            required: true
        },
        teams: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'teams' 
            }],
            validate: [(val) => val.length <= 2, 'Un match ne peut avoir que 2 équipes maximum']
        },
        winner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'teams'
        },
        loser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'teams'
        },
        score: [{
            team: { type: mongoose.Schema.Types.ObjectId, ref: 'teams' },
            points: Number
        }]
    },
    {
        timestamps: true,
    }
);


module.exports = mongoose.model('matches',matchesSchema);
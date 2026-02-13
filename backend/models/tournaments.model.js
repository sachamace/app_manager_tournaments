const mongoose = require("mongoose")

const tournamentSchema = mongoose.Schema(
    {
        games: {
            type: String,
            required: true,
        },
        tree_type: {
            type: String,
            required: true
        },
        cashprize: {
            type: Number,
        },
        list_teams: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'teams' 
        }],
        account: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account',
            required: true
        }
    },
    {
        timestamps: true,
    }
);


module.exports = mongoose.model('tournaments',tournamentSchema);
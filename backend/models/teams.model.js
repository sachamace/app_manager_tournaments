const mongoose = require("mongoose")

const teamSchema = mongoose.Schema(
    {
        tournament: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tournaments',
            required: true
        },
        nom:{
            type: String,
            required: true
        },
        acronyme:{
            type: String,
            required: true
        },
        logo: {
            type: String
        },
        captain: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'players'
        },
        players: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'players'
        }]
    },
    {
        timestamps: true,
    }
);


module.exports = mongoose.model('teams',teamSchema);
const mongoose = require("mongoose")

const teamSchema = mongoose.Schema(
    {
        tournament: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tournaments',
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
            ref: 'Players'
        },
        players: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Players'
        }]
    },
    {
        timestamps: true,
    }
);


module.exports = mongoose.model('Teams',teamSchema);
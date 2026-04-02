const mongoose = require("mongoose")

const playerSchema = mongoose.Schema(
    {
        pseudo: {
            type: String,
            required: true
        },
        team: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Teams',
                default: null
            }],
            validate: [(val) => !val || val.length <= 1, 'Un joueur ne peut avoir que une équipe maximum']
        }
    },
    {
        timestamps: true,
    }
);


module.exports = mongoose.model('Players',playerSchema);
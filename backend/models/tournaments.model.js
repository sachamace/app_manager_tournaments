const mongoose = require("mongoose");

const tournamentSchema = mongoose.Schema(
    {
        games: { type: String, required: true },
        tree_type: { type: String, required: true },
        cashprize: { type: String },
        list_teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teams' }],
        account: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
        classement: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teams' }],
        statut : {type: String , required: true}
    },
    {
        timestamps: true,
        toJSON: { virtuals: true }, // IMPORTANT : Permet d'afficher les virtuals quand on renvoie du JSON
        toObject: { virtuals: true }
    }
);

tournamentSchema.virtual('matches', {
    ref: 'Matches', // Le nom du modèle cible
    localField: '_id', // Le champ dans le Tournoi (son ID)
    foreignField: 'tournament' // Le champ dans le Match qui pointe vers le tournoi
});

module.exports = mongoose.model('Tournaments', tournamentSchema);
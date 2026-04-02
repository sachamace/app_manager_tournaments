const {getAuthsLogic,getAuthLogic,connectAuthLogic,setAuthLogic,updateAuthLogic} = require('../services/auth.service');
const asyncHandler = require('express-async-handler');
// Les controlers get ! 

module.exports.getAuths = asyncHandler(async (req, res) => {
    const accounts = await getAuthsLogic();
    res.status(200).json(accounts);

});

module.exports.getAuth = asyncHandler(async (req, res) => {
    const account = await getAuthLogic(req.params.id);
    res.status(200).json(account);

});
// Les controllers post ! 

// Créer un compte
module.exports.setAuth = asyncHandler(async(req,res) =>{

    const {pseudo, mail, mdp, birthday} = req.body;

    const user = await setAuthLogic(pseudo, mail, mdp, birthday);

    return res.status(200).json({message: "Création de compte réussie",user});
});
// S'identifier à un compte 
module.exports.connectAuth = asyncHandler(async (req, res) => {
    const { mail, mdp } = req.body;
    const { user, token } = await connectAuthLogic(mail, mdp);

    return res.status(200).json({ 
        message: "Connexion réussie", 
        user, 
        token 
    });
});

module.exports.updateAccount = asyncHandler(async (req, res) => {
    const idAccount = req.params.id;
    const donneesAModifier = req.body; 

    const accountUpdated = await updateAuthLogic(idAccount, donneesAModifier);

    return res.status(200).json({ 
        message: "Profil mis à jour avec succès", 
        user: accountUpdated 
    });

});

// .. controller à venir... 
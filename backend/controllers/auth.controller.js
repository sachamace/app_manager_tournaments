const AccountModel = require('../models/auth.model');


// Les controlers get ! 

module.exports.getAuths = async(req,res) =>{
    const accounts = await AccountModel.find();
    res.status(200).json(accounts);
};

module.exports.getAuth = async(req,res) =>{
    const account = await AccountModel.findById(req.params.id);
    res.status(200).json(account);
};

// Les controllers post ! 

// Créer un compte
module.exports.setAuth = async(req,res) =>{
    // On récupère les données du body (JSON) ou des query params (URL)
    const {pseudo, mail, mdp, birthday} = (req.body && Object.keys(req.body).length > 0) ? req.body : req.query;
    
    // Tout les tests ! 
    if(!pseudo){
        return res.status(400).json({message: "Merci d'ajouter un pseudo !"});
    }
    if(!mail){
        return res.status(400).json({message: "Merci d'ajouter un email !"});
    }
    if(!mdp){
        return res.status(400).json({message: "Merci d'ajouter un mot de passe !"});
    }
    const account = await AccountModel.create({
        pseudo,
        mail,
        mdp,
        birthday
    })
    res.status(200).json(account)
};
// S'identifier à un compte 
module.exports.connectAuth = async (req, res) => {
    const { mail, mdp } = (req.body && Object.keys(req.body).length > 0) ? req.body : req.query;
    // Test 
    if (!mail ) {
        return res.status(400).json({ message: "Merci de fournir un email  !" });
    }
    if(!mdp){
        return res.status(400).json({ message: "Merci de fournir un mot de passe !" });
    }

    
    const user = await AccountModel.findOne({ mail: mail });

    // test 
    if (!user) {
        return res.status(400).json({ message: "Utilisateur non trouvé !" });
    }

    
    if (user.mdp !== mdp) {
        return res.status(400).json({ message: "Mot de passe incorrect !" });
    }

    res.status(200).json({ message: "Connexion réussie", user });
};

// Controllers pour patch 

module.exports.changePassword = async (req,res) => {
    const mdp = (req.body && Object.keys(req.body).length > 0) ? req.body : req.query;
    const account = await AccountModel.findById(req.params.id);
    if(!account){
        return res.status(400).json({message : "Ce compte n'existe pas !"});
    }
    const updateAccount = await AccountModel.findByIdAndUpdate(
        account,
        mdp,
        {new : true}   
    )
    res.status(200).json(updateAccount);
};

// .. controller à venir... 
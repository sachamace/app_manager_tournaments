const AccountModel = require('../models/auth.model');
const {connectAuthLogic,setAuthLogic,changePasswordLogic} = require('../services/auth.service');

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
    try {
        const {pseudo, mail, mdp, birthday} = (req.body && Object.keys(req.body).length > 0) ? req.body : req.query;

        const user = await setAuthLogic(pseudo, mail, mdp, birthday);

        return res.status(200).json({message: "Création de compte réussie",user});
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

};
// S'identifier à un compte 
module.exports.connectAuth = async (req, res) => {

    try {
        const { mail, mdp } = (req.body && Object.keys(req.body).length > 0) ? req.body : req.query;

        const newUser = await connectAuthLogic(mail, mdp);

        return res.status(200).json({ message: "Connexion réussie", newUser });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Controllers pour patch 

module.exports.changePassword = async (req,res) => {
    


    try {
        const oldMdp = (req.body && Object.keys(req.body).length > 0) ? req.body : req.query;
        const idAccount = req.params.id;
        const updateMDP= await changePasswordLogic(idAccount,oldMdp);
        return res.status(200).json({ message: "Modification de mot de passe réussie", updateAccount });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// .. controller à venir... 
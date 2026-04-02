const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10; // Facteur de travail

const AccountModel = require('../models/auth.model');
const AppError = require('../utils/appError.js');

const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);
  return hashedPassword;
};

const getAuthsLogic = async () => {
    return await AccountModel.find();
};

const getAuthLogic = async (id) => {
    return await AccountModel.findById(id);
};

const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

const connectAuthLogic = async (mail, mdp) => {
    console.log("Recherche de l'email :", `|${mail}|`);
    if (!mail) throw new AppError("Merci de fournir un email !", 400);
    if (!mdp) throw new AppError("Merci de fournir un mot de passe !", 400);


    const user = await AccountModel.findOne({ mail: mail.toLowerCase().trim()});
    if (!user) throw new AppError("Utilisateur non trouvé !", 404);

    const isVerif = await verifyPassword(mdp,user.mdp);
    if (!isVerif) {
      throw new AppError("Mot de passe incorrect !", 401);
    }
    // Création du token
    const token = jwt.sign(
        { id: user._id }, // Le payload : les infos qu'on stocke dans le token (PAS DE MOT DE PASSE ICI)
        process.env.JWT_SECRET, // Ta clé secrète
        { expiresIn: '24h' } 
    );
    return {user,token};
};

const setAuthLogic = async (pseudo,mail,mdp,birthday) => {
    if(!pseudo) throw new AppError("Merci d'ajouter un pseudo !", 400);
    
    if(!mail) throw new AppError("Merci d'ajouter un email !", 400);
    if(!mdp) throw new AppError("Merci d'ajouter un mot de passe !", 400);
    const emailExiste = await AccountModel.findOne({ mail: mail });
    if (emailExiste) {
        throw new AppError("Cet email est déjà utilisé !", 409); // 409 = Conflit
    }
    const hashmdp = await hashPassword(mdp);

    const account = await AccountModel.create({
        pseudo,
        mail,
        mdp: hashmdp,
        birthday
    })
    
    
    return account;
};


// Dans services/auth.service.js

const updateAuthLogic = async (idAuth, donneesRecues) => {
    const account = await AccountModel.findById(idAuth);
    if (!account) throw new AppError("Compte introuvable", 404);

    // 1. La "Whitelist" : Les champs qu'on AUTORISE à modifier
    const champsAutorises = ['pseudo', 'mail', 'birthday', 'mdp'];
    const donneesFiltrees = {};

    // 2. On boucle sur ce qu'on a reçu et on garde que ce qui est autorisé
    for (const cle in donneesRecues) {
        if (champsAutorises.includes(cle)) {
            donneesFiltrees[cle] = donneesRecues[cle];
        }
    }

    // 3. Le Cas Spécial : Si le mot de passe fait partie des modifications !
    if (donneesFiltrees.mdp) {
        donneesFiltrees.mdp = await hashPassword(donneesFiltrees.mdp);
    }

    // 4. On met à jour avec $set (qui ne modifie que les champs précisés)
    const updateAccount = await AccountModel.findByIdAndUpdate(
        idAuth,
        { $set: donneesFiltrees },
        { new: true, runValidators: true } // runValidators vérifie que le mail est bien formaté par ex.
    );
    
    return updateAccount;
}
module.exports = {
  getAuthsLogic,
  getAuthLogic,
  connectAuthLogic,
  setAuthLogic,
  updateAuthLogic
};
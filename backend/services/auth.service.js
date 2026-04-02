const bcrypt = require('bcrypt');
const saltRounds = 10; // Facteur de travail

const AccountModel = require('../models/auth.model');

const hashPassword = async (plainPassword) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Erreur lors du hachage du mot de passe :', error);
    throw error;
  }
};


const verifyPassword = async (plainPassword, hashedPassword) => {
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    if (match) {
      console.log('✅ Mot de passe valide');
    } else {
      console.log('❌ Mot de passe invalide');
    }
    return match;
  } catch (error) {
    console.error('Erreur lors de la vérification du mot de passe :', error);
    throw error;
  }
};

const connectAuthLogic = async (mail, mdp) => {

    if (!mail) throw new Error("Merci de fournir un email !");
    if (!mdp) throw new Error("Merci de fournir un mot de passe !");


    const user = await AccountModel.findOne({ mail: mail });
    if (!user) throw new Error("Utilisateur non trouvé !");

    const isVerif = await verifyPassword(mdp,user.mdp);
    if (!isVerif) {
        throw new Error("Mot de passe incorrect !");
    }

    return user;
};

const setAuthLogic = async (pseudo,mail,mdp,birthday) => {
    if(!pseudo) throw new Error("Merci d'ajouter un pseudo !");
    
    if(!mail) throw new Error("Merci d'ajouter un email !");
    if(!mdp) throw new Error("Merci d'ajouter un mot de passe !");

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
    if (!account) throw new Error("Compte introuvable");

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
module.exports = {connectAuthLogic,setAuthLogic,updateAuthLogic}
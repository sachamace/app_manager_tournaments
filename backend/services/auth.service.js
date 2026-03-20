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


const changePasswordLogic = async(idAuth,newMdp) => {

    if(!account){
        return null;
    }
    const hashedNewMdp = await hashPassword(newMdp);

    const updateAccount = await AccountModel.findByIdAndUpdate(
        idAuth,
        { mdp: hashedNewMdp },
        {new : true}   
    )
    
    
    return updateAccount
}
module.exports = {connectAuthLogic,setAuthLogic,changePasswordLogic}
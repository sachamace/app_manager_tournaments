const mongoose = require('mongoose');

const connectDB = async () =>{
    try{
        mongoose.set('strictQuery', false);
        // On attend la connexion sans passer de callback
        await mongoose.connect(process.env.MONGO_URI);
        
        console.log("Mongo connecté");
    }catch(err){
        console.log("Erreur lors de ma connexion à MongoDB :",err);
        process.exit();
    }
};

module.exports = connectDB;
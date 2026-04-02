// backend/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

module.exports.checkAuth = (req, res, next) => {
    try {
        //  On récupère le header "Authorization"
        const authHeader = req.headers.authorization;

        //  On vérifie s'il est présent et s'il commence bien par "Bearer " (convention standard)
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Accès refusé. Vous n'êtes pas connecté." });
        }

        // On extrait le token (on enlève "Bearer " pour ne garder que la chaîne de caractères)
        const token = authHeader.split(' ')[1];

        //  On vérifie si le token est valide avec notre clé secrète
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // On attache l'ID de l'utilisateur à l'objet `req`
        // Ainsi, tous tes controllers sauront QUI fait la requête !
        req.user = { id: decodedToken.id };

        // 6. Tout est bon, on laisse passer à la suite (le controller)
        next(); 
        
    } catch (error) {
        // Si le token est expiré ou falsifié, jwt.verify va crash et atterrir ici
        return res.status(401).json({ message: "Token invalide ou expiré. Veuillez vous reconnecter." });
    }
};
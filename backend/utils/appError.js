class AppError extends Error {
    constructor(message, statusCode) {
        // Appelle le constructeur parent (Error) avec le message
        super(message);
        
        // On attache notre code HTTP personnalisé (400, 404, etc.)
        this.statusCode = statusCode;

        // 💡 Astuce de pro : Cela permet de garder une trace propre dans la console
        // pour savoir exactement à quelle ligne l'erreur a été déclenchée.
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
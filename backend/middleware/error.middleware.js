const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

    res.status(statusCode).json({
        message: err.message || "Une erreur inattendue est survenue",
        // La stack trace n'est visible qu'en développement !
        stack: process.env.NODE_ENV === 'production' ? null : err.stack 
    });
};

module.exports = { errorHandler };
const handleError = (err, req, res, next) => {
    return res.status(err.status || 500).json({
        message: err.message || 'couldnt find what you looking for!',
        code: err.code || 'code is not avilable at the moment'
    });
}
module.exports = handleError;
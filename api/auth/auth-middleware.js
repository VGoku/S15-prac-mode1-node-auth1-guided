// Asynchronous middleware function that protects routes
async function protect(req, res, next) {
    // Check if the user is authenticated (exists in session)
    if (req.session.user) {
        // If user is authenticated, proceed to the next middleware/route handler
        next()
    } else {
        // If the user is not authenticated, return a 401 Unauthorized error with a custom message
        next({ status: 401, message: "You don't have the right tools." })
    }
    // The following line is commented out but was likely used for debugging purposes:
    // console.log("protect is working")
    // next() - This would have been another way to call the next function, but it's not needed here.
}

// Exporting the 'protect' middleware to be used in other files
module.exports = {
    protect,
}

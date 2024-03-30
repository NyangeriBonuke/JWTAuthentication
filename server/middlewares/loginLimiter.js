const rateLimit = require('express-rate-limit')

const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, please try again',
    handler: (req, res, next) => {
        const remainingTime = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000)
        res.status(429).json({
            error: 'Too many requests try again later',
            retryAfter: remainingTime
        })
        next()
    }
})

module.exports = loginRateLimiter
const jwt = require("jsonwebtoken");

class AuthService {
    constructor() { }
    static generateAccessToken(payload) {
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET || '', {
            expiresIn: '24h'
        });
        console.info({ accessToken: token})
        return token;
    }
}

module.exports = AuthService;
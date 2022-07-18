const jwt = require("jsonwebtoken");

class AuthService {
    constructor() { }
    static generateAccessToken(payload) {
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET || '', {
            expiresIn: '8760h'
        });
        console.info({ accessToken: token})
        return token;
    }
}

module.exports = AuthService;
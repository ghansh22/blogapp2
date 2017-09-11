const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    // uri: 'mongodb://localhost:27017/blogapp',
    uri: 'mongodb://ghanshyam:ghanshyam@ds133104.mlab.com:33104/blogapp',
    secret: crypto,
    db: 'blogapp'
}
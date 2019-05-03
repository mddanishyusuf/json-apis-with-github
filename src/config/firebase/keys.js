const prodENV = require('./firebase-prod');
const devENV = require('./firebase-prod');

if (process.env.NODE_ENV === 'production') {
    module.exports = prodENV;
} else {
    module.exports = devENV;
}

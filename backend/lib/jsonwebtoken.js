import baseJwt from 'jsonwebtoken';
import util from 'util';

const sign = util.promisify(baseJwt.sign);
const decode = util.promisify(baseJwt.decode);
const verify = util.promisify(baseJwt.verify);

export default {
    sign,
    verify,
    decode,
};
import Validate from 'validate.js';
import { checkUser } from './service';

Validate.validators.checkUser = async function(value) {
    try {
        await checkUser(value);
        return null;
    } catch (e) {
        return 'Email already in use';
    }
};

export const rules = {
    firstName: {
        presence: { allowEmpty: false },
    },
    lastName: {
        presence: { allowEmpty: false },
    },
    password: {
        presence: { allowEmpty: false },
        length: { minimum: 3 },
    },
    email: {
        presence: { allowEmpty: false },
        email: true,
        checkUser: true,
    },
};

export const validate = (fields) => Validate.async(fields, rules);

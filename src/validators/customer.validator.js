import expressValidator from 'express-validator';
import { PLANET_NAMES, MONSTER_ANCESTORS, PIZZA_TOPPINGS } from '../libs/constants.js';
const { body } = expressValidator;

class CustomerValidators {

    partial(){
        return [
            body('planet').optional()
            .isIn(PLANET_NAMES).withMessage('Le nom de la planète doit exister dans le tableau de constante.'),

            body('coord.lat').optional()
            .isFloat({min: -1000, max:1000}).withMessage('Doit être un réel entre -1000 et 1000'),
            body('coord.lon').optional()
            .isFloat({min: -1000, max:1000}).withMessage('Doit être un réel entre -1000 et 1000'),

            body('phone').optional()
            .isHexadecimal().withMessage('Le numéro de téléphone doit être hexadécimal.')
            .isLength(16).withMessage('Le numéro de téléphone doit être 16 caractères.'),

        ];
    }

    complete(){
        return [
            body('name').exists().withMessage('Le nom du client est requis.'),
            body('email').exists().withMessage('Un courriel est requis.'),
            body('planet').exists().withMessage('Le nom de la planète est requis.'),
            body('phone').exists().withMessage('Le numéro de téléphone est requis.'),
            body('coord.lat').exists().withMessage('La latitude est requise.'),
            body('coord.lon').exists().withMessage('La longitude est requise.'),
            body('birthday').exists().withMessage('La date de naissance est requise.'),
            ...this.partial()
        ]
    }

}

export default new CustomerValidators();
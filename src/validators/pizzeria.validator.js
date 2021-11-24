import expressValidator from 'express-validator';
import { PLANET_NAMES, MONSTER_ANCESTORS, PIZZA_TOPPINGS } from '../libs/constants.js';
const { body } = expressValidator;

class PizzeriaValidators {
    partial() {
        return [
            body('planet').isIn(PLANET_NAMES).withMessage('Le nom de la planète doit exister dans le tableau de constante.'),
            body('chef.ancestor').isIn(MONSTER_ANCESTORS).withMessage('Le nom de l\'ancêtre du chef doit exister dans le tableau de constante.'),
            body('chef.speciality').isIn(PIZZA_TOPPINGS).withMessage('Le nom de la spécialité du chef doit exister dans le tableau de constante.')
        ];
    }

    complete() {
        return [
            body('planet').exists().withMessage('Le nom de la planète est requis.'),
            body('coord.lat').exists().withMessage('La latitude est requise.'),
            body('coord.lon').exists().withMessage('La longitude est requise.'),
            body('chef.name').exists().withMessage('Le nom du chef est requis.'),
            body('chef.ancestor').exists().withMessage('L\'ancêtre du chef est requis.'),
            body('chef.speciality').exists().withMessage('La spécialité du chef est requise.'),
            ... this.partial()
        ];
    }

}

export default new PizzeriaValidators();
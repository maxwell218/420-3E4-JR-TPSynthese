import expressValidator from 'express-validator';
const { body } = expressValidator;

class PizzeriaValidators {

    complete() {
        body('planet').exists().withMessage('Le nom de la planète est requis.'),
        body('coord.lat').exists().withMessage('La latitude est requise.'),
        body('coord.lon').exists().withMessage('La longitude est requise.'),
        body('chef.name').exists().withMessage
    }

}

export default new PizzeriaValidators();
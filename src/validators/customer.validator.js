import expressValidator from 'express-validator';
const { body } = expressValidator;

class CustomerValidators {

    partial(){
        return [];
    }

    complete(){
        return [
            body('name').exists().withMessage('Le nom du client est requis.'),
            body('email').exists().withMessage('Un courriel est requis.'),
            body('planet').exists().withMessage('Le nom de la planète est requis.'),
            body('coord.lat').exists().withMessage('La latitude est requise.'),
            body('coord.lon').exists().withMessage('La longitude est requise.'),
            body('birthday').exists().withMessage('La date de naissance est requise.'),
            ...this.partial()
        ]
    }

}

export default new CustomerValidators();
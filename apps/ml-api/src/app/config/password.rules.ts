import passowrdValidator from 'password-validator';

const schema = () => {
    const passwordSchema = new passowrdValidator();

    passwordSchema
        .is()
        .min(8)
        .is()
        .max(20)
        .has()
        .uppercase()
        .has()
        .lowercase()
        .has()
        .digits(1)
        .has()
        .not()
        .spaces()
        .is()
        .not()
        .oneOf(['Passw0rd', 'Password123']);

    return passwordSchema;
};

export default schema;

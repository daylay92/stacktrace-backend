import Joi from '@hapi/joi';
import Helpers from '../utils';

const { getErrorLabel } = Helpers;

const questionSchema = Joi.object({
  text: Joi.string()
    .required()
    .min(6)
    .label('A question should be atleast 6 characters long')
});

const validateQuestionSchema = body => {
  const { error } = questionSchema.validate(body);
  const label = getErrorLabel(error);
  if (label) return label;
  return true;
};

export default validateQuestionSchema;

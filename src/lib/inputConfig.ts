import * as Yup from 'yup';
import { FormValues } from '@/types/formTypes';

export type ValidationSchema = {
  [key: string]: Yup.StringSchema | Yup.Schema<any>;
};

export const createValidationSchema = (fields: { name: string; validation: Yup.Schema<any> }[]) => {
  return Yup.object().shape(
    fields.reduce<ValidationSchema>((acc, field) => {
      acc[field.name] = field.validation;
      return acc;
    }, {})
  );
};
export const signupInitialValues: FormValues = {
  name: '',
  email: '',
  password: '',
};

export const loginInitialValues: FormValues = {
  email: '',
  password: '',
};
interface FormField {
  label: string;
  type: string;
  name: string;
  validation: Yup.Schema<any>;
}

export const loginFields: FormField[] = [
  {
    label: 'Email',
    type: 'text',
    name: 'email',
    validation: Yup.string().email('Invalid email format').required('Email is required'),
  },
  {
    label: 'Password',
    type: 'password',
    name: 'password',
    validation: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters long'),
  },
];

export const signupFields: FormField[] = [
  {
    label: 'Name',
    type: 'text',
    name: 'name',
    validation: Yup.string()
      .required('Name is required')
      .min(6, 'Name must be at least 6 characters long')
      .max(20, 'Name must be at most 10 characters long')
      .matches(/^[a-zA-Z][a-zA-Z0-9 ]*$/, 'Name must start with a letter and not contain special characters'), 
  },
  {
    label: 'Email',
    type: 'text',
    name: 'email',
    validation: Yup.string().email('Invalid email format').required('Email is required'),
  },
  {
    label: 'Password',
    type: 'password',
    name: 'password',
    validation: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters long')
      .matches(/^(?=(.*[a-z]){2})(?=(.*[A-Z]){2})(?=(.*\d){2})(?=(.*[!@#$%^&*(),.?":{}|<>]){2})[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/, 
               'Password must contain at least 2 uppercase letters, 2 lowercase letters, 2 digits, and 2 special characters'),
  },
];

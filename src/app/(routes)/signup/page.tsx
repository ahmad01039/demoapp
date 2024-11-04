"use client";
import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Input from '../../../components/inputs/Input';
import { signupFields } from '../../../lib/inputConfig'; 
import { signup } from '../../../lib/apiWrapper'; 
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
interface FormValues {
  name: string;
  email: string;
  password: string;
}
const SignupPage: React.FC = () => {
  const router = useRouter();
  const initialValues: FormValues = {
    name: '',
    email: '',
    password: '',
  };

  type ValidationSchema = {
    [key: string]: Yup.StringSchema | Yup.Schema<any>; 
  };

  const validationSchema = Yup.object().shape(
    signupFields.reduce<ValidationSchema>((acc, field) => {
      acc[field.name] = field.validation; 
      return acc;
    }, {} as ValidationSchema)
  );
  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, setErrors, resetForm }: FormikHelpers<FormValues>
  ) => {
    try {
      await signup(values);
      toast.success("User created successfully!");
      resetForm();
      router.push('/login'); 
    } catch (error) {
      toast.error("An error occurred while signing up!");
      setErrors({ email: "An error occured" }); 
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Sign Up</h2>
        <Toaster />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {signupFields.map((field) => (
                <div key={field.name}>
                  <Field
                    name={field.name}
                    type={field.type}
                    as={Input}
                    label={field.label}
                  />
                  <ErrorMessage name={field.name} component="div" className="text-red-500 text-sm mb-4" />
                </div>
              ))}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
              >
                Sign Up
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignupPage;

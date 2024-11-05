"use client";
import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { signIn } from 'next-auth/react';
import Input from '../../../components/inputs/Input';
import { toast, Toaster } from 'react-hot-toast';
import { loginFields,createValidationSchema } from '../../../lib/inputConfig'; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FormValues } from '@/types/formTypes';
const LoginPage: React.FC = () => {
  const router = useRouter();
  const initialValues: FormValues = {
    email: '',
    password: '',
  };
  const validationSchema = createValidationSchema(loginFields);
  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, setErrors, resetForm }: FormikHelpers<FormValues>
  ) => {
    const result = await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
    });
    console.log("SignIn result:", result);
    if (result?.error && result?.error != null) {
      setErrors({ email: result.error });
      toast.error(result.error);
    } else {
      toast.success("Logged in successfully!");
      resetForm();
      router.push('/dashboard');
    }
    setSubmitting(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Login</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {loginFields.map((field) => (
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
                className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
              >
                Login
              </button>
            </Form>
          )}
        </Formik>
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default LoginPage;

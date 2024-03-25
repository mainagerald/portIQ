import React from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../Context/useAuth";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

type Props = {};

type RegisterFormsInputs = {
  email: string;
  userName: string;
  password: string;
};

const validation = Yup.object().shape({
  email: Yup.string().required("Email is required"),
  userName: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const RegisterPage = (props: Props) => {
  const { registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormsInputs>({ resolver: yupResolver(validation) });

  const handleRegister = (form: RegisterFormsInputs) => {
    registerUser(form.email, form.userName, form.password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-indigo-300">
      <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Sign up for PortIQ
        </h1>
        <form onSubmit={handleSubmit(handleRegister)}>
          <div className="mb-4">
            <label htmlFor="email" className="text-gray font-medium">
              Email
            </label>
            <input
              type="text"
              id="email"
              className="w-full mt-2 px-4 py-2 rounded-md bg-white bg-opacity-50 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-red-500 mt-1">{errors.email.message}</p>
            ) : (
              ""
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="text-gray font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full mt-2 px-4 py-2 rounded-md bg-white bg-opacity-50 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Choose a username"
              {...register("userName")}
            />
            {errors.userName ? (
              <p className="text-red-500 mt-1">{errors.userName.message}</p>
            ) : (
              ""
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="text-gray font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full mt-2 px-4 py-2 rounded-md bg-white bg-opacity-50 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Choose a password"
              {...register("password")}
            />
            {errors.password ? (
              <p className="text-red-500 mt-1">{errors.password.message}</p>
            ) : (
              ""
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors duration-300"
          >
            Sign up
          </button>
          <p className="text-center mt-4 text-gray-700">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

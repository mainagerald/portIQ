import React from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../Context/useAuth";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

type Props = {};

type LoginFormsInputs = {
  userName: string;
  password: string;
};

const validation = Yup.object().shape({
  userName: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const LoginPage = (props: Props) => {
  const { loginUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormsInputs>({ resolver: yupResolver(validation) });

  const handleLogin = (form: LoginFormsInputs) => {
    loginUser(form.userName, form.password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-indigo-300">
      <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome to PortIQ
        </h1>
        <form onSubmit={handleSubmit(handleLogin)}>
          <div className="mb-4">
            <label htmlFor="username" className="text-gray font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full mt-2 px-4 py-2 rounded-md bg-white bg-opacity-50 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your username"
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
              placeholder="Enter your password"
              {...register("password")}
            />
            {errors.password ? (
              <p className="text-red-500 mt-1">{errors.password.message}</p>
            ) : (
              ""
            )}
          </div>
          <div className="flex items-center justify-between mb-6">
            <a
              href="#"
              className="text-gray hover:text-gray-600 font-medium"
            >
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors duration-300"
          >
            Sign in
          </button>
          <p className="text-center mt-4 text-gray-700">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

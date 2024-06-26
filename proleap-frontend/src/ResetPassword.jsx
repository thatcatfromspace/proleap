import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "./assets/PL_Logo_RGB.png";

const onSubmit = (data) => {
  console.log(data);
};

const schema = yup.object().shape({
  currentPassword: yup.string().required("Name is a required field."),
  newPassword: yup
    .string()
    .min(4)
    .max(20)
    .required("Password is a required field."),
  confirmPassword: yup.string().min(4).max(20).required("Repeat password."),
});

export const ResetPassword = ({ setCookie, setUserId, setUserName }) => {
  const [toggleValue, setValue] = useState(false);
  const toggleSetValue = () => {
    setValue(!toggleValue);
  };
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const loginUser = (obj) => {
    axios
      .post(`http://${import.meta.env.VITE_API_URL}/api/reset_password`, obj)
      .then((res) => {
        console.log(res.data);
        // const response = res.data;
        // if (res.status === 200) {
        //   // setUserId(response.id);
        //   setCookie("userId", response.id, { path: "/", secure: true });
        //   setCookie("userName", response.username, { path: "/", secure: true });

        //   setCookie("accessToken", response.tokens.access, {
        //     path: "/",
        //     secure: true,
        //   });
        //   setCookie("refreshToken", response.tokens.refresh, {
        //     path: "/",
        //     secure: true,
        //   });
        navigate("/dashboard");
      });
  };

  const RenderEye = () => {
    if (toggleValue) {
      return (
        <svg
          className="relative left-[240px] top-3.5"
          width="20px"
          height="20px"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          color="#000000"
        >
          <path
            d="M12 14a2 2 0 100-4 2 2 0 000 4z"
            stroke="#000000"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M21 12c-1.889 2.991-5.282 6-9 6s-7.111-3.009-9-6c2.299-2.842 4.992-6 9-6s6.701 3.158 9 6z"
            stroke="#000000"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      );
    } else
      return (
        <svg
          className="relative left-[240px] top-3.5"
          width="20px"
          height="20px"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          color="#000000"
        >
          <path
            d="M3 3l18 18M10.5 10.677a2 2 0 002.823 2.823"
            stroke="#000000"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M7.362 7.561C5.68 8.74 4.279 10.42 3 12c1.889 2.991 5.282 6 9 6 1.55 0 3.043-.523 4.395-1.35M12 6c4.008 0 6.701 3.158 9 6a15.66 15.66 0 01-1.078 1.5"
            stroke="#000000"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      );
  };

  return (
    <div className="login [height:100%] [min-height:100vh] flex items-center justify-center lg:justify-center [background-image:url('./assets/background.png')]">
      <div className="login-back flex-col bg-gray3 w-[35vw] min-w-[400px] max-w-[450px] h-30vh rounded-lg px-10 py-5">
        <form
          onSubmit={handleSubmit((e) => {
            loginUser(e);
          })}
          className="login-form my-auto py-3"
        >
          <div className="flex justify-between items-center mb-4">
            <label className="font-poppins text-3xl font-medium text-logingreen me-10">
              {" "}
              Forgot password?{" "}
            </label>
            <img src={logo} alt="proleap logo" width={150} />
          </div>
          <div className="flex-col mb-5">
            <div>
              <label className="font-poppins text-slate-500 ">
                {"Current password"}
              </label>
            </div>
            <input
              className="bg-gray-200 font-poppins h-14 rounded-md mt-4 active:outline-none after:outline-none px-3 w-full"
              placeholder="*******"
              type="password"
              {...register("currentPassword")}
            ></input>
          </div>
          <div className="flex-col mb-5">
            <div>
              <label className="font-poppins text-slate-500 ">
                {"New password"}
              </label>
            </div>
            <input
              className="bg-gray-200 font-poppins h-14 rounded-md mt-4 active:outline-none after:outline-none px-3 w-full"
              placeholder="*******"
              type="password"
              {...register("newPassword")}
            ></input>
          </div>
          <div className="flex-col mb-5">
            <div>
              <label className="font-poppins text-slate-500 ">
                {"Confirm new password"}
              </label>
            </div>
            <input
              className="bg-gray-200 font-poppins h-14 rounded-md mt-4 active:outline-none after:outline-none px-3 w-full"
              placeholder="*******"
              type="password"
              {...register("confirmPassword")}
            ></input>
          </div>
          <button className="bg-gradient-to-b from-logingreen to-emerald-900 hover:bg-gradient-to-t hover:from-logingreen hover:to-emerald-900 w-full h-14 font-poppins font-semibold text-white my-5 rounded-lg transition-colors">
            {" "}
            {"CHANGE PASSWORD"}
          </button>
        </form>
      </div>
    </div>
  );
};

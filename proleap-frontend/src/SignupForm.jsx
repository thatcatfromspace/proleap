import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";

const onSubmit = (data) => {
  console.log(data);
};

const schema = yup.object().shape({
  email: yup.string().email().required("Email is a required field."),
  password: yup
    .string()
    .min(4)
    .max(20)
    .required("Password is a required field."),
  confirm: yup
    .string()
    .min(4)
    .max(20)
    .oneOf([yup.ref("password"), null])
    .required(),
});

export const SignupForm = () => {
  const [toggleValue, setValue] = useState(false);

  const toggleSetValue = () => {
    setValue(!toggleValue);
  };

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const RenderEye = () => {
    if (toggleValue) {
      return (
        <svg
          className="relative top-2 left-56"
          width="20px"
          height="20px"
          stroke-width="1.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          color="#000000"
        >
          <path
            d="M12 14a2 2 0 100-4 2 2 0 000 4z"
            stroke="#000000"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M21 12c-1.889 2.991-5.282 6-9 6s-7.111-3.009-9-6c2.299-2.842 4.992-6 9-6s6.701 3.158 9 6z"
            stroke="#000000"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      );
    } else
      return (
        <svg
          className="relative top-2 left-56"
          width="20px"
          height="20px"
          stroke-width="1.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          color="#000000"
        >
          <path
            d="M3 3l18 18M10.5 10.677a2 2 0 002.823 2.823"
            stroke="#000000"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M7.362 7.561C5.68 8.74 4.279 10.42 3 12c1.889 2.991 5.282 6 9 6 1.55 0 3.043-.523 4.395-1.35M12 6c4.008 0 6.701 3.158 9 6a15.66 15.66 0 01-1.078 1.5"
            stroke="#000000"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      );
  };

  return (
    <div className="sign-up flex h-screen items-center justify-end bg-gray3 lg:[background-image:linear-gradient(75deg,theme(colors.gray3)_50%,theme(colors.primary1)_50%)]">
      <div className="sign-up-form  w-[100%]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col mx-auto px-3 py-3 w-[40%] lg:w-[350px] gap-8 text-center "
        >
          <span className="text-4xl my-5 font-poppins">Sign Up</span>
          <input
            type="text"
            className="bg-gray2 h-12 rounded-2xl text-md px-4"
            placeholder="Username"
          />
          <input
            type="text"
            className="bg-gray2 h-12 rounded-2xl text-md px-4"
            placeholder="Email"
          />
          <input
            type="password"
            className="bg-gray2 h-12 rounded-2xl text-md px-4"
            placeholder="Enter password"
          />
          <input
            type="password"
            className="bg-gray2 h-12 rounded-2xl text-md px-4"
            placeholder="Re-enter password"
          />
          <button className="bg-tertiary h-12 rounded-3xl mx-[33.33%] my-3 ">
            Submit
          </button>
        </form>
      </div>
      <div className="lg:flex hidden backdrop place-content-end mx-[5vw] ">
        <svg
          width="500"
          height="500"
          viewBox="0 0 687 384"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M102.06 100.888C100.98 107.476 98.442 113.524 94.446 119.032C90.45 124.432 84.996 128.806 78.084 132.154C71.28 135.502 63.234 137.176 53.946 137.176H36.774L29.484 178H1.782L21.87 64.276H66.744C78.624 64.276 87.588 66.922 93.636 72.214C99.684 77.398 102.708 84.472 102.708 93.436C102.708 96.136 102.492 98.62 102.06 100.888ZM55.566 115.468C65.934 115.468 72.036 110.608 73.872 100.888C74.088 99.16 74.196 97.918 74.196 97.162C74.196 93.706 73.062 91.06 70.794 89.224C68.634 87.28 65.286 86.308 60.75 86.308H45.684L40.662 115.468H55.566ZM169.456 64.276C181.228 64.276 190.192 66.976 196.348 72.376C202.504 77.668 205.582 84.58 205.582 93.112C205.582 95.596 205.366 97.918 204.934 100.078C203.638 107.638 200.344 114.388 195.052 120.328C189.76 126.268 182.686 130.48 173.83 132.964L192.136 178H160.87L144.832 135.07H138.19L130.576 178H102.874L122.962 64.276H169.456ZM176.584 101.212C176.8 99.484 176.908 98.35 176.908 97.81C176.908 94.354 175.774 91.708 173.506 89.872C171.346 87.928 168.106 86.956 163.786 86.956H146.614L141.592 115.468H158.764C163.84 115.468 167.836 114.226 170.752 111.742C173.776 109.258 175.72 105.748 176.584 101.212ZM262.661 179.134C253.049 179.134 244.571 177.136 237.227 173.14C229.991 169.144 224.375 163.528 220.379 156.292C216.383 149.056 214.385 140.74 214.385 131.344C214.385 118.06 217.247 106.234 222.971 95.866C228.695 85.39 236.633 77.236 246.785 71.404C257.045 65.572 268.655 62.656 281.615 62.656C291.335 62.656 299.867 64.654 307.211 68.65C314.555 72.538 320.225 78.1 324.221 85.336C328.217 92.464 330.215 100.672 330.215 109.96C330.215 123.244 327.353 135.178 321.629 145.762C315.905 156.238 307.913 164.446 297.653 170.386C287.393 176.218 275.729 179.134 262.661 179.134ZM266.873 153.538C274.001 153.538 280.265 151.702 285.665 148.03C291.065 144.358 295.223 139.444 298.139 133.288C301.163 127.024 302.675 120.274 302.675 113.038C302.675 105.262 300.515 99.16 296.195 94.732C291.875 90.304 285.827 88.09 278.051 88.09C270.923 88.09 264.605 89.926 259.097 93.598C253.697 97.27 249.485 102.184 246.461 108.34C243.545 114.388 242.087 121.084 242.087 128.428C242.087 136.204 244.247 142.36 248.567 146.896C252.887 151.324 258.989 153.538 266.873 153.538Z"
            fill="white"
          />
          <path
            d="M262.21 316.94H298.498L294.772 338H230.782L250.87 224.276H278.572L262.21 316.94ZM351.887 246.146L347.837 269.798H384.935L381.209 290.696H344.111L339.575 316.13H381.533L377.645 338H307.985L328.073 224.276H397.733L393.845 246.146H351.887ZM469.988 317.912H427.544L417.176 338H388.178L449.414 224.276H481.49L502.55 338H473.228L469.988 317.912ZM466.748 296.852L460.106 254.732L438.398 296.852H466.748ZM615.351 260.888C614.271 267.476 611.733 273.524 607.737 279.032C603.741 284.432 598.287 288.806 591.375 292.154C584.571 295.502 576.525 297.176 567.237 297.176H550.065L542.775 338H515.073L535.161 224.276H580.035C591.915 224.276 600.879 226.922 606.927 232.214C612.975 237.398 615.999 244.472 615.999 253.436C615.999 256.136 615.783 258.62 615.351 260.888ZM568.857 275.468C579.225 275.468 585.327 270.608 587.163 260.888C587.379 259.16 587.487 257.918 587.487 257.162C587.487 253.706 586.353 251.06 584.085 249.224C581.925 247.28 578.577 246.308 574.041 246.308H558.975L553.953 275.468H568.857Z"
            fill="#349959"
          />
        </svg>
      </div>
    </div>
  );
};

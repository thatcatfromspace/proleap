import { useEffect, useState } from "react";
// import { Cards } from "./Cards";
import axios from "axios";
import { Cards } from "./Cards";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
export const Dashboard = ({ uid, userName, isAuthenticated, batchID, batchname }) => {
  const [activeElement, setActiveElement] = useState(0);
  const isAuth = isAuthenticated;
  const userId = uid;
  const uName = userName;
  const batchId = batchID;
  const batchName = batchname;

  const navigate = useNavigate();
  const changeActiveElement = (e, itemId) => {
    e.preventDefault();
    setActiveElement(itemId);
  };

  const [currentCardId, setCurrentCardId] = useState();
  const [showActivity, setShowActivity] = useState(true);
  const [showCard, setShowCard] = useState(false);
  const [activity, setActivity] = useState(null);
  const [currentActivity, setCurrentActivity] = useState();
  useEffect(() => {
    if (batchID != null) {
      console.log(batchId);
      axios
        .get(
          `http://${import.meta.env.VITE_API_URL
          }/apis/user/${userId}/batch/${batchId}/activities/`,
        )
        .then((res) => {
          let response = res.data;
          console.log(res.data);
          setActivity(response);
          //   TODO: add batch id to req
        });
    }
  }, []);
  useEffect(() => {
    // setShowActivity(false);
    if (currentCardId != null) {
      console.log(currentCardId);
      setShowCard(true);
    }
  }, [setShowActivity, currentCardId, setCurrentCardId]);
  return isAuth === true ? (
    <main className="h-screen w-screen bg-primary overflow-x-hidden text-[30px]  ">
      <Sidebar
        activeElement={activeElement}
        setActiveElement={changeActiveElement}
      />
      <div className="w-[80%] relative bg-gray3 rounded-l-2xl min-h-screen max-h-fit left-[20%] p-8">
        <div className="mainarea relative z-1">
          <div className="nav flex w-full justify-between px-8">
            <div>
              <span>Welcome Rahul!</span>
            </div>
          </div>
          <div className="w-full mt-12">
            {showActivity && (
              <ul className="flex flex-wrap justify-start gap-[2%] w-full  ">
                {activity!= null
                  ? activity.activities.map((val, index) => (
                    <button
                      onClick={(e) => {
                        setCurrentCardId(val.current_card);
                        setCurrentActivity(val);
                        // console.log(val.card_ids.indexOf(val.current_card));
                        setShowActivity(false);
                        setShowCard(true);
                      }}
                      className="flex w-[49%] my-2 flex-col flex-wrap h-[25vh] shadow-2xl   px-8 py-4 border-b-[12px] rounded-xl border-logingreen "
                      key={index}
                    >
                      <li  className="">
                        <span className="text-[30px] justify-start flex">
                          {val.name}
                        </span>
                        <span className="text- justify-start text-[18.54px] flex">
                          {val.desc}
                        </span>
                      </li>
                    </button>
                  ))
                  : null}

                <li className=" About you flex w-[49%] my-2 flex-wrap h-[25vh] shadow-2xl overflow-y-hidden border-b-[12px] rounded-xl border-[#BABBBF] px-8 py-4">
                  <div className="w-full flex justify-between items-center border-dotted border-b-2  border-black">
                    <span className="text-[30px] w-[90%] justify-start flex">
                      About You
                    </span>
                    <svg
                      width="32"
                      height="25"
                      viewBox="0 0 32 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M29.333 0H2.667C1.95967 0 1.28131 0.280988 0.781146 0.781147C0.280987 1.28131 0 1.95967 0 2.667L0 22.222C0 22.5722 0.068984 22.919 0.203013 23.2426C0.337043 23.5662 0.533492 23.8602 0.781146 24.1079C1.0288 24.3555 1.32281 24.552 1.64638 24.686C1.96996 24.82 2.31676 24.889 2.667 24.889H29.333C29.6832 24.889 30.03 24.82 30.3536 24.686C30.6772 24.552 30.9712 24.3555 31.2189 24.1079C31.4665 23.8602 31.663 23.5662 31.797 23.2426C31.931 22.919 32 22.5722 32 22.222V2.667C32 1.95967 31.719 1.28131 31.2189 0.781147C30.7187 0.280988 30.0403 0 29.333 0ZM9.778 5.333C10.4813 5.333 11.1688 5.54155 11.7536 5.93229C12.3384 6.32303 12.7942 6.87841 13.0633 7.52818C13.3325 8.17795 13.4029 8.89294 13.2657 9.58274C13.1285 10.2725 12.7898 10.9062 12.2925 11.4035C11.7952 11.9008 11.1615 12.2395 10.4717 12.3767C9.78194 12.5139 9.06695 12.4435 8.41718 12.1743C7.7674 11.9052 7.21203 11.4494 6.82129 10.8646C6.43056 10.2798 6.222 9.59231 6.222 8.889C6.22279 7.94613 6.5977 7.04211 7.26441 6.3754C7.93111 5.7087 8.83513 5.33379 9.778 5.333ZM16 18.489C15.975 18.7948 15.8303 19.0785 15.5973 19.2782C15.3644 19.478 15.0621 19.5778 14.756 19.556H4.8C4.49391 19.5778 4.19157 19.478 3.95865 19.2782C3.72573 19.0785 3.58104 18.7948 3.556 18.489V17.422C3.63262 16.505 4.0673 15.655 4.76596 15.0561C5.46462 14.4572 6.37104 14.1575 7.289 14.222H7.567C8.26722 14.5154 9.01882 14.6664 9.778 14.6664C10.5372 14.6664 11.2888 14.5154 11.989 14.222H12.267C13.185 14.1575 14.0914 14.4572 14.79 15.0561C15.4887 15.655 15.9234 16.505 16 17.422V18.489ZM28.444 15.556C28.4435 15.6736 28.3965 15.7862 28.3134 15.8694C28.2302 15.9525 28.1176 15.9995 28 16H20C19.8824 15.9995 19.7698 15.9525 19.6866 15.8694C19.6035 15.7862 19.5565 15.6736 19.556 15.556V14.667C19.5563 14.5492 19.6031 14.4363 19.6863 14.353C19.7695 14.2696 19.8822 14.2225 20 14.222H28C28.1176 14.2225 28.2302 14.2695 28.3134 14.3526C28.3965 14.4358 28.4435 14.5484 28.444 14.666V15.556ZM28.444 12C28.4435 12.1176 28.3965 12.2302 28.3134 12.3134C28.2302 12.3965 28.1176 12.4435 28 12.444H20C19.8824 12.4435 19.7698 12.3965 19.6866 12.3134C19.6035 12.2302 19.5565 12.1176 19.556 12V11.111C19.5565 10.9934 19.6035 10.8808 19.6866 10.7976C19.7698 10.7145 19.8824 10.6675 20 10.667H28C28.1176 10.6675 28.2302 10.7145 28.3134 10.7976C28.3965 10.8808 28.4435 10.9934 28.444 11.111V12ZM28.444 8.444C28.4435 8.56159 28.3965 8.67422 28.3134 8.75737C28.2302 8.84053 28.1176 8.88747 28 8.888H20C19.8824 8.88747 19.7698 8.84053 19.6866 8.75737C19.6035 8.67422 19.5565 8.56159 19.556 8.444V7.555C19.5565 7.43741 19.6035 7.32478 19.6866 7.24163C19.7698 7.15847 19.8824 7.11153 20 7.111H28C28.1176 7.11153 28.2302 7.15847 28.3134 7.24163C28.3965 7.32478 28.4435 7.43741 28.444 7.555V8.444Z"
                        fill="#BABBBF"
                      />
                    </svg>
                  </div>
                  <span className="text-[18.54px] max-h-[25vh] justify-start flex ">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Accusamus doloremque exercitationem ea eum perferendis
                    placeat aliquam sed laboriosam obcaecati sit hic cupiditate
                    ipsum voluptatum unde sapiente at, nulla consectetur
                    quaerat?
                  </span>
                </li>

                <li className=" Linkedin flex w-[49%] my-2 flex-wrap h-[25vh] shadow-2xl overflow-y-hidden border-b-[12px] rounded-xl border-[#0077B5] px-8 py-4">
                  <div className="w-full flex justify-between items-center border-dotted border-b-2  border-black">
                    <span className="text-[30px] w-[90%] justify-start flex">
                      LinkedIn
                    </span>
                    <svg
                      width="60"
                      height="60"
                      viewBox="0 0 70 70"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g filter="url(#filter0_d_1_100)">
                        <path
                          d="M20 34C20 29.2533 21.4076 24.6131 24.0447 20.6663C26.6819 16.7195 30.4302 13.6434 34.8156 11.8269C39.201 10.0104 44.0266 9.53512 48.6822 10.4612C53.3377 11.3872 57.6141 13.673 60.9706 17.0294C64.327 20.3859 66.6128 24.6623 67.5388 29.3178C68.4649 33.9734 67.9896 38.799 66.1731 43.1844C64.3566 47.5698 61.2805 51.3181 57.3337 53.9553C53.3869 56.5924 48.7468 58 44 58C37.6348 58 31.5303 55.4714 27.0294 50.9706C22.5286 46.4697 20 40.3652 20 34Z"
                          fill="#0077B5"
                        />
                      </g>
                      <path
                        d="M45.411 46.221H39.971C39.971 46.089 40.042 31.404 39.971 29.88H45.411V32.194C45.8346 31.5017 46.3918 30.9007 47.05 30.426C48.016 29.7864 49.156 29.4609 50.314 29.494C51.1444 29.4616 51.9722 29.6052 52.7431 29.9154C53.514 30.2257 54.2106 30.6955 54.787 31.294C56.0678 32.8529 56.7074 34.8407 56.576 36.854V46.223H51.137V37.476C51.137 35.791 50.659 33.782 48.38 33.782C47.7214 33.7715 47.0801 33.9935 46.569 34.409C46.1339 34.7728 45.7973 35.2401 45.59 35.768C45.448 36.1946 45.3873 36.644 45.411 37.093V46.22V46.221ZM36.961 46.221H31.521V29.878H36.961V46.219V46.221ZM34.241 27.647H34.206C33.8167 27.6719 33.4264 27.6161 33.0596 27.4831C32.6929 27.3501 32.3575 27.1427 32.0747 26.874C31.7918 26.6053 31.5675 26.2811 31.4159 25.9216C31.2642 25.5622 31.1885 25.1753 31.1934 24.7852C31.1983 24.3951 31.2837 24.0102 31.4444 23.6547C31.605 23.2991 31.8374 22.9806 32.1269 22.7191C32.4164 22.4576 32.7569 22.2588 33.1269 22.135C33.4968 22.0113 33.8884 21.9653 34.277 22C34.6657 21.9696 35.0564 22.0201 35.4246 22.1482C35.7928 22.2764 36.1304 22.4794 36.4163 22.7446C36.7021 23.0097 36.9298 23.3312 37.0852 23.6887C37.2406 24.0463 37.3202 24.4322 37.319 24.822C37.3241 25.1941 37.2533 25.5634 37.111 25.9073C36.9686 26.2511 36.7577 26.5624 36.491 26.822C35.8776 27.3805 35.07 27.6766 34.241 27.647Z"
                        fill="white"
                      />
                      <defs>
                        <filter
                          id="filter0_d_1_100"
                          x="0"
                          y="0"
                          width="88"
                          height="88"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feOffset dy="10" />
                          <feGaussianBlur stdDeviation="10" />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.161 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow_1_100"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow_1_100"
                            result="shape"
                          />
                        </filter>
                      </defs>
                    </svg>
                  </div>
                  <span className="text-[18.54px] max-h-[25vh] justify-start flex ">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Accusamus doloremque exercitationem ea eum perferendis
                    placeat aliquam sed laboriosam obcaecati sit hic cupiditate
                    ipsum voluptatum unde sapiente at, nulla consectetur
                    quaerat?
                  </span>
                </li>

                <li className="Tip of the dayflex w-[49%] my-2 flex-wrap h-[25vh] shadow-2xl overflow-y-hidden rounded-xl bg-logingreen px-8 py-4">
                  <div className="w-full flex justify-between items-center border-dotted border-b-2">
                    <span className="text-[30px] w-[90%] justify-start  flex">
                      Tip of the Day
                    </span>
                    <svg
                      width="33"
                      height="33"
                      viewBox="0 0 33 33"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.5 33C13.2366 33 10.0465 32.0323 7.3331 30.2193C4.61969 28.4062 2.50484 25.8293 1.256 22.8143C0.00714922 19.7993 -0.319606 16.4817 0.31705 13.281C0.953707 10.0803 2.52518 7.14031 4.83275 4.83275C7.14031 2.52518 10.0803 0.953707 13.281 0.31705C16.4817 -0.319606 19.7993 0.00714922 22.8143 1.256C25.8293 2.50484 28.4062 4.61969 30.2193 7.3331C32.0323 10.0465 33 13.2366 33 16.5C32.995 20.8745 31.255 25.0685 28.1617 28.1617C25.0685 31.255 20.8745 32.995 16.5 33ZM16.5 21.45C16.1734 21.4498 15.854 21.5465 15.5824 21.7278C15.3107 21.9092 15.099 22.167 14.9739 22.4687C14.8488 22.7705 14.816 23.1025 14.8797 23.4229C14.9434 23.7432 15.1006 24.0375 15.3316 24.2684C15.5625 24.4994 15.8568 24.6567 16.1772 24.7203C16.4975 24.784 16.8296 24.7512 17.1313 24.6261C17.433 24.5011 17.6908 24.2893 17.8722 24.0176C18.0535 23.746 18.1502 23.4266 18.15 23.1C18.1495 22.6626 17.9755 22.2432 17.6661 21.9339C17.3568 21.6245 16.9375 21.4505 16.5 21.45ZM16.5 8.25001C16.0626 8.25054 15.6432 8.42455 15.3339 8.73387C15.0245 9.04319 14.8505 9.46256 14.85 9.90001V16.5C14.85 16.9376 15.0238 17.3573 15.3333 17.6667C15.6427 17.9762 16.0624 18.15 16.5 18.15C16.9376 18.15 17.3573 17.9762 17.6667 17.6667C17.9762 17.3573 18.15 16.9376 18.15 16.5V9.90001C18.1492 9.46274 17.9751 9.04362 17.6658 8.73451C17.3565 8.42541 16.9373 8.25154 16.5 8.25101V8.25001Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <span className="text-[18.54px] max-h-[25vh] justify-start flex ">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Dolor dolore voluptates, a nulla tempora debitis explicabo
                    perferendis? Consectetur aut voluptatibus, error omnis
                    placeat atque dolore amet architecto dolor voluptates alias.
                  </span>
                </li>

                <li className="Status flex w-[49%] my-2 flex-wrap h-[25vh] shadow-2xl overflow-y-hidden border-b-[12px] rounded-xl  px-8 py-4 border-[#FFC943]">
                  <div className="w-full flex justify-between items-center border-dotted border-b-2  border-black">
                    <span className="text-[30px] w-[90%] justify-start flex">
                      Status
                    </span>
                    <svg
                      width="32"
                      height="24"
                      viewBox="0 0 32 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M31 20H4V1C4 0.734784 3.89464 0.480429 3.70711 0.292892C3.51957 0.105356 3.26522 0 3 0H1C0.734784 0 0.48043 0.105356 0.292893 0.292892C0.105357 0.480429 0 0.734784 0 1L0 22C0 22.5304 0.210714 23.0391 0.585786 23.4142C0.960859 23.7893 1.46957 24 2 24H31C31.2652 24 31.5196 23.8946 31.7071 23.7071C31.8946 23.5196 32 23.2652 32 23V21C32 20.7348 31.8946 20.4804 31.7071 20.2929C31.5196 20.1054 31.2652 20 31 20ZM29 2H21.621C21.3242 1.99987 21.0341 2.08777 20.7873 2.25258C20.5405 2.41739 20.3481 2.65171 20.2345 2.92588C20.121 3.20005 20.0912 3.50176 20.1492 3.79282C20.2071 4.08388 20.3501 4.35122 20.56 4.561L22.585 6.586L18 11.172L13.414 6.586C13.0389 6.21106 12.5303 6.00043 12 6.00043C11.4697 6.00043 10.9611 6.21106 10.586 6.586L6.293 10.879C6.10553 11.0665 6.00021 11.3208 6.00021 11.586C6.00021 11.8512 6.10553 12.1055 6.293 12.293L7.707 13.707C7.89453 13.8945 8.14884 13.9998 8.414 13.9998C8.67916 13.9998 8.93347 13.8945 9.121 13.707L12 10.828L16.586 15.414C16.9611 15.7889 17.4697 15.9996 18 15.9996C18.5303 15.9996 19.0389 15.7889 19.414 15.414L25.414 9.414L27.439 11.439C27.6488 11.6489 27.9161 11.7919 28.2072 11.8498C28.4982 11.9078 28.7999 11.878 29.0741 11.7645C29.3483 11.6509 29.5826 11.4585 29.7474 11.2117C29.9122 10.9649 30.0001 10.6748 30 10.378V3C30 2.73478 29.8946 2.48043 29.7071 2.29289C29.5196 2.10536 29.2652 2 29 2Z"
                        fill="#FFC943"
                      />
                    </svg>
                  </div>
                  <span className="text-[18.54px] max-h-[25vh] justify-start flex ">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Dolor dolore voluptates, a nulla tempora debitis explicabo
                    perferendis? Consectetur aut voluptatibus, error omnis
                    placeat atque dolore amet architecto dolor voluptates alias.
                  </span>
                </li>
                <li className="Deadlines flex w-[49%] my-2 flex-wrap h-[25vh] shadow-2xl overflow-y-hidden border-b-[12px] rounded-xl border-[#FF8900] px-8 py-4">
                  <div className="w-full flex justify-between items-center border-dotted border-b-2  border-black">
                    <span className="text-[30px] w-[90%] justify-start flex">
                      Deadlines
                    </span>
                    <svg
                      width="33"
                      height="33"
                      viewBox="0 0 33 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M32.979 23.872C32.9795 26.9314 32.1028 29.9269 30.4528 32.5032C28.8029 35.0796 26.4489 37.1289 23.6698 38.4083C20.8907 39.6877 17.8031 40.1435 14.7729 39.7216C11.7427 39.2998 8.89699 38.018 6.57301 36.0283C4.24903 34.0385 2.54425 31.4242 1.66072 28.4951C0.777193 25.566 0.751963 22.4451 1.58802 19.5021C2.42408 16.5591 4.08637 13.9175 6.37788 11.8905C8.66938 9.86338 11.494 8.53578 14.517 8.06501V5.41201H12.363C12.1185 5.41122 11.8841 5.31372 11.7112 5.1408C11.5383 4.96787 11.4408 4.73357 11.44 4.48901V1.41201C11.4408 1.16746 11.5383 0.933153 11.7112 0.760228C11.8841 0.587303 12.1185 0.489805 12.363 0.489014H21.593C21.8376 0.489805 22.0719 0.587303 22.2448 0.760228C22.4177 0.933153 22.5152 1.16746 22.516 1.41201V4.48901C22.5152 4.73357 22.4177 4.96787 22.2448 5.1408C22.0719 5.31372 21.8376 5.41122 21.593 5.41201H19.439V8.06501C22.2567 8.5004 24.9055 9.68544 27.108 11.496L29.223 9.38101C29.3088 9.29502 29.4108 9.2268 29.523 9.18025C29.6352 9.13371 29.7555 9.10975 29.877 9.10975C29.9985 9.10975 30.1188 9.13371 30.231 9.18025C30.3432 9.2268 30.4452 9.29502 30.531 9.38101L32.708 11.558C32.794 11.6438 32.8622 11.7458 32.9088 11.858C32.9553 11.9702 32.9793 12.0905 32.9793 12.212C32.9793 12.3335 32.9553 12.4538 32.9088 12.566C32.8622 12.6782 32.794 12.7802 32.708 12.866L30.447 15.127L30.401 15.173C32.0902 17.7593 32.9863 20.783 32.979 23.872ZM19.439 26.641V14.989C19.4382 14.7445 19.3407 14.5102 19.1678 14.3372C18.9949 14.1643 18.7606 14.0668 18.516 14.066H15.44C15.1955 14.0668 14.9611 14.1643 14.7882 14.3372C14.6153 14.5102 14.5178 14.7445 14.517 14.989V26.641C14.5178 26.8856 14.6153 27.1199 14.7882 27.2928C14.9611 27.4657 15.1955 27.5632 15.44 27.564H18.517C18.7614 27.563 18.9954 27.4653 19.1681 27.2924C19.3409 27.1196 19.4382 26.8854 19.439 26.641Z"
                        fill="#FF8900"
                      />
                    </svg>
                  </div>
                  <span className="text-[18.54px] max-h-[25vh] justify-start flex ">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Accusamus doloremque exercitationem ea eum perferendis
                    placeat aliquam sed laboriosam obcaecati sit hic cupiditate
                    ipsum voluptatum unde sapiente at, nulla consectetur
                    quaerat?
                  </span>
                </li>
              </ul>
            )}
          </div>
          {!showActivity && showCard && activeElement === 0 ? (
            <Cards
              uid={userId}
              Activity={currentActivity}
              setShowActivity={setShowActivity}
              setShowCard={setShowCard}
            />
          ) : null}
        </div>
      </div>
    </main>
  ) : (
    navigate("/")
  );
};

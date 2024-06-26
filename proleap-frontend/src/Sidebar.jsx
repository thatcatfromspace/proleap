import logo from "./assets/logo.svg";
import {
  Bell,
  Bookmark,
  Calendar,
  House,
  LogOut,
  Mail,
  Settings,
} from "lucide-react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

const cookies = new Cookies();
function removeAllCookies() {
  cookies.remove("accessToken");
  cookies.remove("batchId");
  cookies.remove("batchName");
  cookies.remove("refreshToken");
  cookies.remove("userId");
  cookies.remove("userName");
}
export const Sidebar = ({ activeElement, setActiveElement }) => {
  const navigate = useNavigate();
  const inactiveElementStyle = {
    color: "#F4F6FC",
    opacity: "0.4",
  };
  const activeElementStyle = {
    color: "#F4F6FC",
    opacity: "1",
  };
  return (
    <div className="sidebar w-[20%] min-w-[300px] flex flex-col px-8 h-full fixed bg-primary border-t-2 border-primary2">
      <div className="mt-16 flex justify-start">
        <img src={logo} alt="" className="w-[75%]" height="40" />
      </div>
      <div className="options flex flex-col mt-24 justify-start gap-y-6 ">
        <div className="flex justify-start gap-x-4 items-center">
          <House style={activeElementStyle} height={60} />
          <div className="text-left text-[24px] text-gray3 ">Home</div>
        </div>

        <div
          className="flex justify-start gap-x-4 items-center"
          style={inactiveElementStyle}
        >
          <Mail height={60} />

          <div className="text-left text-[24px] text-gray3">Inbox</div>
        </div>

        <div
          className="flex justify-start gap-x-4 items-center"
          style={inactiveElementStyle}
        >
          <Bookmark height={60} />

          <div className="text-left text-[24px] text-gray3">Saved</div>
        </div>

        <div
          className="flex justify-start gap-x-4 items-center"
          style={inactiveElementStyle}
        >
          <Calendar height={60} />
          <div className="text-left text-[24px] text-gray3">Calendar</div>
        </div>

        <div
          className="flex justify-start gap-x-4 items-center"
          style={inactiveElementStyle}
        >
          <Bell height={60} />

          <div className="text-left text-[24px] text-gray3">Notifications</div>
        </div>

        <div
          className="flex justify-start gap-x-4 items-center"
          style={inactiveElementStyle}
        >
          <Settings height={60} />
          <div className="text-left text-[24px] text-gray3">Settings</div>
        </div>
        <div
          className="flex justify-start gap-x-4 items-center cursor-pointer"
          style={inactiveElementStyle}
        >
          <LogOut height={60} stroke="red" />
          <div
            className="text-left text-[24px] text-[#FF0000]"
            onClick={() => {
              removeAllCookies();
              navigate("/");
            }}
          >
            Logout
          </div>
        </div>
      </div>
    </div>
  );
};

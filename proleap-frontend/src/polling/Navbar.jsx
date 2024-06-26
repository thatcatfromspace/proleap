import logo from "../assets/PL_Logo_RGB.png";
import {
  Bell,
  Book,
  Bookmark,
  Calendar,
  House,
  Mail,
  Settings,
} from "lucide-react";
/**
 * Pass `messages` if there are any messages in the inbox.
 * Pass `notifs` if there are any unread notifications.
 */
export function Navbar({ notifs, messages }) {
  return (
    <div className="nav flex justify-center w-1/4">
      <div>
        <div className="flex h-8 mt-8">
          <img
            src={logo}
            alt="ProLeap"
            height="25"
            width="193"
            className="size-fit"
          />
        </div>
        <div className="mt-16">
          <div className="flex-col font-poppins">
            <div className="flex justify-start items-center gap-x-3 cursor-pointer">
              <House style={{ color: "#F4F6FC" }} height="40" />
              <label className="font-normal text-gray-50"> Home </label>
            </div>
            <div className="flex justify-start items-center mt-8 gap-x-3 cursor-pointer relative">
              <Mail style={{ color: "#F4F6FC", opacity: "30%" }} height="40" />
              <label className="font-normal text-gray-50"> Inbox </label>
              {messages ? (
                <div className="h-[5px] w-[5px] rounded-full bg-yellow-300 absolute top-0 right-24 text-transparent">
                  .
                </div>
              ) : null}
            </div>
            <div className="flex justify-start items-center mt-8 gap-x-3 cursor-pointer">
              <Bookmark
                style={{ color: "#F4F6FC", opacity: "30%" }}
                height="40"
              />
              <label className="font-normal text-gray-50"> Saved </label>
            </div>
            <div className="flex justify-start items-center mt-8 gap-x-3 cursor-pointer">
              <Calendar
                style={{ color: "#F4F6FC", opacity: "30%" }}
                height="40"
              />
              <label className="font-normal text-gray-50"> Calendar </label>
            </div>
            <div className="flex justify-start items-center mt-8 gap-x-3 cursor-pointer">
              <Book style={{ color: "#F4F6FC", opacity: "30%" }} height="40" />
              <label className="font-normal text-gray-50">
                {"Health Card"}
              </label>
            </div>
            <div className="flex justify-start items-center mt-8 gap-x-3 cursor-pointer">
              <Bell style={{ color: "#F4F6FC", opacity: "30%" }} height="40" />
              <label className="font-normal text-gray-50">Notifications</label>
            </div>
            <div className="flex justify-start items-center mt-8 gap-x-3 mb-32">
              <Settings
                style={{ color: "#F4F6FC", opacity: "30%" }}
                height="40"
              />
              <label className="font-normal text-gray-50"> Settings </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

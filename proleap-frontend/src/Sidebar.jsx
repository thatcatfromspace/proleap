import logo from "./assets/logo.svg";
import {
  CalendarToday,
  CollectionsBookmark,
  ExitToApp,
  HomeSharp,
  Message,
  Notifications,
  Settings,
} from "@material-ui/icons";

export const Sidebar = ({ activeElement, setActiveElement }) => {
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
        <div className="flex justify-start gap-x-8 items-center">
          <HomeSharp style={activeElementStyle} height={60} />
          <div className="text-left text-[24px] text-gray3 ">Home</div>
        </div>

        <div
          className="flex justify-start gap-x-8 items-center"
          style={inactiveElementStyle}
        >
          <Message height={60} />

          <div className="text-left text-[24px] text-gray3">Inbox</div>
        </div>

        <div
          className="flex justify-start gap-x-8 items-center"
          style={inactiveElementStyle}
        >
          <CollectionsBookmark height={60} />

          <div className="text-left text-[24px] text-gray3">Saved</div>
        </div>

        <div
          className="flex justify-start gap-x-8 items-center"
          style={inactiveElementStyle}
        >
          <CalendarToday height={60} />
          <div className="text-left text-[24px] text-gray3">Calendar</div>
        </div>

        <div
          className="flex justify-start gap-x-8 items-center"
          style={inactiveElementStyle}
        >
          <Notifications height={60} />

          <div className="text-left text-[24px] text-gray3">Notifications</div>
        </div>

        <div
          className="flex justify-start gap-x-8 items-center"
          style={inactiveElementStyle}
        >
          <Settings height={60} />
          <div className="text-left text-[24px] text-gray3">Settings</div>
        </div>
        <div
          className="flex justify-start gap-x-8 items-center hover:text-red-400"
          style={inactiveElementStyle}
        >
          <ExitToApp height={60} />
          <div className="text-left text-[24px] text-gray3 hover:text-red-400">
            Logout
          </div>
        </div>
      </div>
    </div>
  );
};

import { memo } from "react";
import HeaderTab from "./HeaderTab";
import ControlBar from "../flow_chart_panel/views/ControlBar";
import { useWindowSize } from "react-use";
import { HEADER_HEIGHT } from "./Layout";

const tabs = [
  {
    to: "/flowchart",
    fullText: "Visual Python Script",
    shortText: "Script",
    testId: "script-btn",
  },
  {
    to: "/devices",
    fullText: "Hardware Devices",
    shortText: "Devices",
    testId: "devices-btn",
  },
  // {
  //   to: "/pymgr",
  //   fullText: "Python Env/Pkg Manager",
  //   shortText: "Python",
  //   testId: "pymgr-btn",
  // },
];

const lg = 1024;

const Header = () => {
  // Actual media query causes flickering... need to use this manual one
  const { width } = useWindowSize();
  const large = width > lg;

  return (
    <div style={{ height: HEADER_HEIGHT }}>
      <div className="flex gap-4">
        <img width={64} height={64} src="assets/logo.png" alt="Logo" />
        {tabs.map((t) => (
          <HeaderTab to={t.to} testId={t.testId} key={t.fullText}>
            {large ? t.fullText : t.shortText}
          </HeaderTab>
        ))}
        <div className="grow" />
        <ControlBar />
      </div>
    </div>
  );
};

export default memo(Header);

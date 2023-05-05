import { useCallback, useEffect, useState } from "react";

import FlowChartTab from "./feature/flow_chart_panel/FlowChartTabView";
import ResultsTab from "./feature/results_panel/ResultsTabView";
import ControlsTab from "./feature/controls_panel/ControlsTabView";

import { GlobalStyles } from "./feature/common/Global";

import "./App.css";
import { useFlowChartState } from "./hooks/useFlowChartState";
import { Node } from "reactflow";
import { useSocket } from "./hooks/useSocket";
import Sidebar from "./feature/flow_chart_panel/SideBar/Sidebar";
import {
  MantineProvider,
  Text,
  ColorScheme,
  ColorSchemeProvider,
} from "@mantine/core";
import { Script } from "vm";
import { Logo } from "./Logo";
import { CustomFonts } from "./feature/common/CustomFonts";
import { darkTheme, lightTheme } from "./feature/common/theme";
import { AppTab, Header } from "./Header";
import { ServerStatus } from "./ServerStatus";

const App = () => {
  const { states } = useSocket();
  const { serverStatus, programResults, runningNode, failedNode } = states!;
  const [openCtrlModal, setOpenCtrlModal] = useState(false);
  const [theme, setTheme] = useState<ColorScheme>("dark");
  const [clickedElement, setClickedElement] = useState<Node | undefined>(
    undefined
  );
  const {
    rfInstance,
    setRfInstance,
    setRunningNode,
    setFailedNode,
    setCtrlsManifest,
    loadFlowExportObject,
  } = useFlowChartState();
  const [currentTab, setCurrentTab] = useState<AppTab>("visual");
  const queryString = window?.location?.search;
  const fileName =
    queryString.startsWith("?test_example_app") && queryString.split("=")[1];

  const toggleColorScheme = (color?: ColorScheme) => {
    setTheme(color || (theme === "dark" ? "light" : "dark"));
  };

  const fetchExampleApp = useCallback(
    (fileName: string) => {
      fetch(`/example-apps/${fileName}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setCtrlsManifest(data.ctrlsManifest);
          const flow = data.rfInstance;
          loadFlowExportObject(flow);
        })
        .catch((err) => console.log("fetch example app err: ", err));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fileName]
  );

  useEffect(() => {
    setRunningNode(runningNode);
    setRunningNode(runningNode);
    setFailedNode(failedNode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runningNode, failedNode]);
  useEffect(() => {
    if (fileName) {
      fetchExampleApp(fileName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileName]);

  return (
    <ColorSchemeProvider
      colorScheme={theme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={theme === "dark" ? darkTheme : lightTheme}
      >
        <GlobalStyles />
        <CustomFonts />
        <ServerStatus serverStatus={serverStatus} />
        <Header
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          setOpenCtrlModal={setOpenCtrlModal}
        />
        <main style={{ minHeight: "85vh" }}>
          <div style={{ display: currentTab === "visual" ? "block" : "none" }}>
            <Sidebar />

            <FlowChartTab
              rfInstance={rfInstance!}
              setRfInstance={setRfInstance}
              results={programResults!}
              theme={theme}
              clickedElement={clickedElement}
              setClickedElement={setClickedElement}
            />
          </div>
          <div style={{ display: currentTab === "panel" ? "block" : "none" }}>
            <ControlsTab
              results={programResults!}
              theme={theme}
              openCtrlModal={openCtrlModal}
              setOpenCtrlModal={setOpenCtrlModal}
            />
          </div>
          <div style={{ display: currentTab === "debug" ? "block" : "none" }}>
            <ResultsTab results={programResults!} />
          </div>
        </main>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default App;

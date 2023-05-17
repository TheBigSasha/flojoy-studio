import clone from "just-clone";
import localforage from "localforage";
import React, { useCallback } from "react";
import Modal from "react-modal";
import { v4 as uuidv4 } from "uuid";

import { modalStyles } from "./style/ControlModalStyles";
import "./style/Controls.css";

import ReactSwitch from "react-switch";
import "@src/App.css";
import {
  CtlManifestType,
  CtrlManifestParam,
  useFlowChartState,
} from "@src/hooks/useFlowChartState";
import { saveAndRunFlowChartInServer } from "@src/services/FlowChartServices";
import ModalCloseSvg from "@src/utils/ModalCloseSvg";
import { useSocket } from "@src/hooks/useSocket";
import { FUNCTION_PARAMETERS } from "@src/feature/flow_chart_panel/manifest/PARAMETERS_MANIFEST";
import { useControlsTabState } from "./ControlsTabState";
import ControlGrid from "./views/ControlGrid";
import { ControlNames } from "./manifest/CONTROLS_MANIFEST";
import { useControlsTabEffects } from "./ControlsTabEffects";
import { CtrlOptionValue } from "./types/ControlOptions";
import { ResultsType } from "@src/feature/results_panel/types/ResultsType";
import { createStyles } from "@mantine/styles";
import { useMantineColorScheme, useMantineTheme } from "@mantine/styles";
import { CtrlValueType } from "@feature/controls_panel/types/CtrlValue";

export const useAddButtonStyle = createStyles((theme) => {
  return {
    addButton: {
      boxSizing: "border-box",
      backgroundColor: theme.colors.modal[0],
      border: theme.colors.accent1[0],
      cursor: "pointer",
    },
  };
});

localforage.config({ name: "react-flow", storeName: "flows" });
interface ControlsTabProps {
  results: ResultsType;
  setOpenCtrlModal: React.Dispatch<React.SetStateAction<boolean>>;
  openCtrlModal: boolean;
}

const ControlsTab = ({
  results,
  setOpenCtrlModal,
  openCtrlModal,
}: ControlsTabProps) => {
  const theme = useMantineTheme();
  const { states } = useSocket();
  const { socketId, setProgramResults } = states!;
  const {
    openEditModal,
    setOpenEditModal,
    currentInput,
    setCurrentInput,
    debouncedTimerId,
    setDebouncedTimerId,
  } = useControlsTabState();

  const {
    rfInstance,
    nodes,
    updateCtrlInputDataForNode,
    removeCtrlInputDataForNode,
    ctrlsManifest,
    setCtrlsManifest,
    isEditMode,
    setIsEditMode,
    gridLayout,
    setGridLayout,
  } = useFlowChartState();

  const afterOpenModal = () => null;
  const closeModal = () => {
    setOpenCtrlModal(false);
  };

  function cacheManifest(manifest: CtlManifestType[]) {
    setCtrlsManifest(manifest);
  }

  const saveAndRunFlowChart = useCallback(() => {
    if (debouncedTimerId) {
      clearTimeout(debouncedTimerId);
    }
    const timerId = setTimeout(() => {
      setProgramResults({ io: [] });
      saveAndRunFlowChartInServer({ rfInstance, jobId: socketId });
    }, 3000);

    setDebouncedTimerId(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTimerId, rfInstance]);

  useControlsTabEffects();

  const removeCtrl = (e: any, ctrl: any = undefined) => {
    const ctrlId = e.target.id;
    console.warn("Removing", ctrlId, ctrl);
    const filterChilds = ctrlsManifest.filter((ctrl) => ctrl.id !== ctrlId);
    cacheManifest(filterChilds);

    // if (ctrl.param) {
    //   removeCtrlInputDataForNode(ctrl.param.nodeId, ctrl.param.id);
    //   saveAndRunFlowChart();
    // }
  };

  const updateCtrlValue = (
    val: string,
    ctrl: CtlManifestType,
    tp: CtrlValueType
  ) => {
    const manClone = clone(ctrlsManifest);
    manClone.forEach((c, i) => {
      // if (c.id === ctrl.id) {
      //   manClone[i].val = isNaN(+val) ? val : +val;
      // }
    });
    cacheManifest(manClone);
    updateCtrlInputDataForNode(
      (ctrl.param! as CtrlManifestParam).nodeId,
      (ctrl.param! as CtrlManifestParam).param,
      {
        functionName: (ctrl.param! as CtrlManifestParam).functionName,
        param: (ctrl.param! as CtrlManifestParam).param,
        value: val,
        ValType: tp,
      }
    );
  };

  const attachParamsToCtrl = (
    param: CtrlOptionValue,
    ctrl: CtlManifestType
  ) => {
    // grab the current value for this param if it already exists in the flowchart nodes
    const inputNode = nodes.find((e) => e.id === param.nodeId);
    const ctrls = inputNode?.data?.ctrls;
    const fnParams = FUNCTION_PARAMETERS[param?.functionName] || {};
    // debugger
    const fnParam = fnParams[param?.param];
    const defaultValue =
      param.functionName === "CONSTANT"
        ? ctrl.val
        : fnParam?.default
        ? fnParam.default
        : 0;
    const ctrlData = ctrls && ctrls[param.param];
    const inputValue = isNaN(+ctrlData?.value!)
      ? ctrlData?.value
      : +ctrlData?.value!;
    const currentInputValue = ctrlData ? inputValue : defaultValue;
    const manClone = clone(ctrlsManifest);
    manClone.forEach((c, i) => {
      if (c.id === ctrl.id) {
        manClone[i].param = param;
        manClone[i].val = currentInputValue;
      }
    });
    cacheManifest(manClone);
  };

  return (
    <div data-testid="controls-tab">
      {/* <AddBtn
        testId={"add-ctrl"}
        handleClick={() => {
          setOpenCtrlModal((prev) => !prev);
          setIsEditMode(true);
        }}
      /> */}
      <ControlGrid
        controlProps={{
          isEditMode,
          results,
          updateCtrlValue,
          attachParamsToCtrl,
          removeCtrl,
          setCurrentInput,
          setOpenEditModal,
        }}
      />

      {/* <AddCtrlModal
        isOpen={openCtrlModal}
        afterOpenModal={afterOpenModal}
        closeModal={closeModal}
        addCtrl={addCtrl}
        theme={theme}
      /> */}
      {/* <Modal
        isOpen={openEditModal}
        onAfterOpen={afterOpenModal}
        onRequestClose={() => setOpenEditModal(false)}
        style={modalStyles(theme)}
        ariaHideApp={false}
        contentLabel="Choose a Python function"
      >
        <button onClick={() => setOpenEditModal(false)} className="close-modal">
          <ModalCloseSvg
            style={{
              height: 23,
              width: 23,
            }}
          />
        </button>
        {currentInput && (
          <div>
            <p>Ctrl properties</p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <p>Hidden</p>
                <ReactSwitch
                  checked={
                    ctrlsManifest[currentInput?.index!]!?.hidden! || false
                  }
                  onChange={(nextChecked) => {
                    setCtrlsManifest((prev) => {
                      prev[currentInput?.index!].hidden = nextChecked;
                    });
                  }}
                />
              </div>
              {ctrlsManifest[currentInput?.index!]?.name ===
                ControlNames.SevenSegmentDisplay && (
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <p>Segment Color </p>
                  <input
                    type="color"
                    name="seven_segment_color"
                    id="seven_segment_color"
                    value={ctrlsManifest[currentInput.index].segmentColor || ""}
                    onChange={(e) => {
                      setCtrlsManifest((prev) => {
                        prev[currentInput?.index!].segmentColor =
                          e.target.value;
                      });
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </Modal> */}
    </div>
  );
};

const AddBtn = ({ handleClick, testId }) => {
  const { classes } = useAddButtonStyle();
  return (
    <button
      data-cy={testId}
      data-testid={testId}
      className={classes.addButton}
      onClick={handleClick}
      style={{
        position: "relative",
        width: "104px",
        height: "43px",
        margin: "10px",
      }}
    >
      + Add CTRL
    </button>
  );
};

export default ControlsTab;

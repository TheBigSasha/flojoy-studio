import { ElementsData } from "@/types";
import { TextData } from "@src/types/node";
import { atom, useAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { ReactFlowJsonObject, Node } from "reactflow";

export type CtrlManifestParam = ElementsData["ctrls"][""] & {
  nodeId: string;
  id: string;
};
export interface PlotManifestParam {
  node: string;
  plot?: PlotType;
  input?: string;
  output?: string;
}

interface PlotType {
  type: string;
  mode: string;
}

export interface CtlManifestType {
  type: string;
  name: string;
  id: string;
  param?: PlotManifestParam | CtrlManifestParam | string;
  val?: string | number | boolean;
  hidden?: boolean;
  segmentColor?: string;
  controlGroup?: string;
  label?: string;
  minHeight: number;
  minWidth: number;
  layout: ReactGridLayout.Layout;
}
export interface EnvVarCredentialType {
  key: string;
  value: string;
}

export type Project = {
  name?: string;
  rfInstance?: ReactFlowJsonObject<ElementsData>;
  textNodes?: Node<TextData>[];
};

export const projectAtom = atomWithImmer<Project>({});
export const projectPathAtom = atom<string | undefined>(undefined);
export const showWelcomeScreenAtom = atom<boolean>(true);

export const failedNodeAtom = atom<Record<string, string>>({});
export const runningNodeAtom = atom<string>("");
export const nodeStatusAtom = atom((get) => ({
  runningNode: get(runningNodeAtom),
  failedNodes: get(failedNodeAtom),
}));

const showLogsAtom = atomWithImmer<boolean>(false);
const editModeAtom = atomWithImmer<boolean>(false);
const credentialsAtom = atomWithImmer<EnvVarCredentialType[]>([]);
const isSidebarOpenAtom = atom<boolean>(false);
const nodeParamChangedAtom = atom<boolean>(false);
export const centerPositionAtom = atom<{ x: number; y: number } | undefined>(
  undefined,
);

const currentPythonEnvAtom = atom<string | undefined>(undefined);

export function useFlowChartState() {
  const [isEditMode, setIsEditMode] = useAtom(editModeAtom);
  const [showLogs, setShowLogs] = useAtom(showLogsAtom);
  const [runningNode, setRunningNode] = useAtom(runningNodeAtom);
  const [failedNodes, setFailedNodes] = useAtom(failedNodeAtom);
  const [credentials, setCredentials] = useAtom(credentialsAtom);
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);
  const [nodeParamChanged, setNodeParamChanged] = useAtom(nodeParamChangedAtom);
  const [currentPythonEnv, setCurrentPythonEnv] = useAtom(currentPythonEnvAtom);

  return {
    isEditMode,
    setIsEditMode,
    showLogs,
    setShowLogs,
    runningNode,
    setRunningNode,
    failedNodes,
    setFailedNodes,
    credentials,
    setCredentials,
    nodeParamChanged,
    setNodeParamChanged,
    isSidebarOpen,
    setIsSidebarOpen,
    currentPythonEnv,
    setCurrentPythonEnv,
  };
}

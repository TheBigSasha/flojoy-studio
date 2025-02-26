import { IServerStatus } from "@src/context/socket.context";
import { useSocket } from "@src/hooks/useSocket";
import { Variants, motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoadingPage = () => {
  const {
    states: { serverStatus },
  } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      ![IServerStatus.OFFLINE, IServerStatus.CONNECTING].includes(serverStatus)
    ) {
      navigate("/flowchart");
    }
  }, [navigate, serverStatus]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-violet-600">
      <BarLoader />
      <div className="py-4" />

      <div className="text-white">Loading...</div>
    </div>
  );
};

const variants = {
  initial: {
    scaleY: 0.5,
    opacity: 0,
  },
  animate: {
    scaleY: 1,
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 1,
      ease: "circIn",
    },
  },
} as Variants;

const BarLoader = () => {
  return (
    <motion.div
      transition={{
        staggerChildren: 0.25,
      }}
      initial="initial"
      animate="animate"
      className="flex gap-1"
    >
      <motion.div variants={variants} className="h-12 w-2 bg-white" />
      <motion.div variants={variants} className="h-12 w-2 bg-white" />
      <motion.div variants={variants} className="h-12 w-2 bg-white" />
      <motion.div variants={variants} className="h-12 w-2 bg-white" />
      <motion.div variants={variants} className="h-12 w-2 bg-white" />
    </motion.div>
  );
};

export default LoadingPage;

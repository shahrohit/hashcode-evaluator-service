import { Request as Req, Response as Res } from "express";

import { channel } from "@/config/queue-config";

const checkHealth = async (_: Req, res: Res) => {
  if (channel) {
    res.status(200).json({
      message: "Server is Up",
    });
  } else {
    res.status(500).json({
      message: "Server is not healthy",
    });
  }
};

export default checkHealth;

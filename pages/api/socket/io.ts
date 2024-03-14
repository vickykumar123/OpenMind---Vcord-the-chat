import {Server as HTTPServer} from "http";
import {NextApiRequest} from "next";
import {Server as ServerIO} from "socket.io";

import {NextApiResponseServerIo} from "types";

export const config = {
  api: {
    bodyParser: false, //If you want to consume the body as a Stream or with raw-body, you can set this to false. Socket need raw data
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: HTTPServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false, //omit the trailing slash and use /socket.io instead of /socket.io/
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;

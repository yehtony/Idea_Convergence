import url from '../url.json';
import config from '../config.json';
import axios from "axios";
import { sendNewNodeMessage } from '../utils/socketTool';


export const newNode = async (ideaData, activityId, ws) => {
  axios
      .post(url.backendHost + config[7].createNode, ideaData)
      .then((response) => {
          console.log(response.status, response.data);
          console.log("5",typeof ws);
          sendNewNodeMessage(ws, {
            ...ideaData,
            activityId: activityId
          });
      });
};

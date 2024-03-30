import url from '../url.json';
import config from '../config.json';
import axios from "axios";
import { sendNewNodeMessage, sendNewEdgeMessage } from '../utils/socketTool';


export const newNode = async (ideaData, activityId, ws) => {
  return axios
      .post(url.backendHost + config[7].createNode, ideaData)
      .then((response) => {
          console.log(response.status, response.data);
          console.log("5",typeof ws);
          sendNewNodeMessage(ws, {
            ...ideaData,
            activityId: activityId
          });
          return response
      });
};

export const newEdge = async (edgeData, activityId, ws) => {
  console.log(`ideaTool:newEdge:edgeData ${edgeData}`);
  return axios
      .post(url.backendHost + config[9].createEdge, edgeData)
      .then((response) => {
          console.log(response.status, response.data);
          console.log("5",typeof ws);
          sendNewEdgeMessage(ws, {
            ...edgeData,
            activityId: activityId
          });
          return response
      });
};
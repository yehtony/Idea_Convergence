import url from '../url.json';
import config from '../config.json';
import axios from "axios";
import { sendNewNodeMessage, sendNewEdgeMessage } from '../utils/socketTool';


export const newNode = async (ideaData, activityId, ws) => {
  return axios
      .post(url.backendHost + config[7].createNode, ideaData)
      .then((response) => {
          // console.log(response.status, response.data);
          // console.log("5",typeof ws);
          sendNewNodeMessage(ws, {
            ...ideaData,
            id:response.data.node.id,
            createdAt:response.data.node.createdAt,
            updatedAt:response.data.node.updatedAt,
            activityId: activityId
          });
          return response
      });
};

export const newEdge = async (edgeData, activityId, ws) => {
  // console.log(`ideaTool:newEdge:edgeData ${edgeData}`);
  return axios
      .post(url.backendHost + config[9].createEdge, edgeData)
      .then((response) => {
          // console.log(response.status, response.data);
          // console.log("5",typeof ws);
          sendNewEdgeMessage(ws, {
            ...edgeData,
            activityId: activityId
          });
          return response
      });
};
function getEmoji(tag){
  switch (tag) {
    case 'idea': {
      return "💡";
    }
    case 'information': {
      return "🔍";
    }
    case 'question': {
      return "❓"
    }
    case 'experiment': {
      return "🧪"
    }
    case 'record': {
      return "📄"
    }
    case 'reply': {
      return "💡"
    }
  }
}

const formatTimestamp = (timestamp) => {
  return new Intl.DateTimeFormat('en-US', {
      // year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      //   second: 'numeric',
      hour12: false,
  }).format(new Date(timestamp));
};

export const genEdge = (edgeData) => {
  // console.log(`ideaTool:genEdge:edgeData `, edgeData);
  return {
    from: edgeData.from,
    to: edgeData.to
  }
};

export const genNode = (ideaData) => {
  // console.log(`ideaTool:genNode:ideaData`, ideaData);
  return {
    id: ideaData.id,
    label: getEmoji(ideaData.tags) + "\n" + "\n" + ideaData.title + "\n"  + "\n" + ideaData.author + "\n" + `${formatTimestamp(ideaData.createdAt)}`,
    title: ideaData.content,
    group: ideaData.tags,
  }
};
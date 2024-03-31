import React, { useState } from 'react';
import { Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormHelperText, TextField, InputLabel, Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { newNode, newEdge } from '../utils/ideaTool';


const scaffold = [
  <Button key="1">【💡我的想法】</Button>,
  <Button key="2">【🧐我覺得更好的想法】</Button>,
  <Button key="3">【❓我想知道】</Button>,
  <Button key="4">【🙅🏻這個想法不能解釋】</Button>,
  <Button key="5">【📄舉例和參考來源】</Button>,
  <Button key="6">【✍🏻我的總結】</Button>
];


export const CreateReply = ({ open, onClose, nodeContent, ws }) => {
    const name = localStorage.getItem('name');
    const nodeDefault = {
      title: "",
      content: "",
      tags: "reply",
      author: name,
      groupId: localStorage.getItem('groupId')
    }

    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(nodeDefault);

    const onEditorStateChange = function (editorState) {
      setEditorState(editorState);
      let content = editorState.getCurrentContent().getPlainText("\u0001");
      setData({
        ...data,
        content: content,
      });
      // console.log("content: ", content);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setData({
            ...data,
            [e.target.name]: value
        });
    };

    const handleButtonClick = (buttonText) => {
      // Concatenate the existing content (or an empty string if it's null) with the buttonText
      const newContent = `${data.content || ''} ${buttonText}`;

      // Update the 'content' property in the 'data' state with the new concatenated content
      setData({
        ...data,
        content: newContent,
      });
    
      // Create a new EditorState with the updated content
      const newEditorState = EditorState.createWithContent(
        ContentState.createFromText(newContent)
      );
      
      // Set the new EditorState in the component state
      setEditorState(newEditorState);
    };


    const handleSubmit = async (e) => {
      e.preventDefault();
      const isTitleValid = data.title.trim().length > 0;
      const titleValidLength = data.title.trim().length < 15;
      if(
        !isTitleValid || 
        !titleValidLength || 
        !editorState.getCurrentContent().hasText() || 
        !editorState.getCurrentContent().getPlainText().length > 0
      ) {
        return alert("請確定以下項目： \n1. 標題及內容都已輸入\n2. 標題長度不超過15個字");
      }
      const ideaData = {
        title: data.title,
        content: data.content,
        tags: data.tags,
        author: data.author,
        groupId: data.groupId
      };
      

      setLoading(true);
      try {
        const responseFromPostNode = await newNode(ideaData, localStorage.getItem('activityId'),ws);
        // console.log(`CreateIdea:responseFromPostNode.data: ${responseFromPostNode.data}`)
        const edgeData = {
          groupId: localStorage.getItem('groupId'),
          from: responseFromPostNode.data.node.id,
          to: localStorage.getItem('nodeId'),
        };
        const responseFromPostEdge = await newEdge(edgeData, localStorage.getItem('activityId'),ws);

        
        //
        onClose(onClose);
        setLoading(false);
        setData(nodeDefault);
        setEditorState(EditorState.createEmpty());
      }
      catch(error){
          if (error.response) {
              // console.log(error.response);
              // console.log("server responded");
              setLoading(false);
          } else if (error.request) {
              // console.log("network error");
              setLoading(false);
          } else {
              // console.log(error);
              setLoading(false);
          }
      }; 
    };

    return (
      <>
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="md"
          scroll='body'
        >
          <DialogTitle>回覆</DialogTitle>
          <Divider variant="middle" />
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {nodeContent && (    // ensure that nodeData is not null or undefined before trying to access its properties.
                    <>
                        <>
                            {nodeContent.content}
                        </>
                    </>
                )}
            </DialogContentText>
            <FormControl variant="standard" fullWidth>
              <TextField
                required
                id="standard-required"
                autoFocus
                margin="dense"
                label={"回應標題"}
                type="text"
                name='title'
                value={data.title}
                fullWidth
                variant="standard"
                onChange={handleChange}
                inputProps={{ maxLength: 15 }}
              />
              <FormHelperText id="component-helper-text">
                請為你的回覆下一個標題，讓其他同學能更快速的了解你的回覆內容！
              </FormHelperText>
            </FormControl>
            <Box
              sx={{
                display: 'flex',
                '& > *': {
                  m: 1,
                },
              }}
            >
              <ButtonGroup
                orientation="vertical"
                aria-label="vertical outlined button group"
                style={{ color:'#ECF2FF' }}
              >
                {scaffold.map((button, index) => (
                  <Button
                    key={index}
                    editorState={editorState}
                    onEditorStateChange={onEditorStateChange}
                    onClick={() => {
                      handleButtonClick(button.props.children); 
                      // console.log(button.props.children)
                    }}
                  >
                    {button.props.children}
                  </Button>
                ))}
              </ButtonGroup>
              <Editor
                editorState={editorState}
                onEditorStateChange={onEditorStateChange}
                wrapperClassName="wrapper-class"
                editorClassName="editor-class"
                toolbarClassName="toolbar-class"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>取消</Button>
            <LoadingButton type='submit' onClick={handleSubmit} loading={loading} loadingPosition="start" variant="contained">送出</LoadingButton>
          </DialogActions>
        </Dialog>
      </>
    );
}
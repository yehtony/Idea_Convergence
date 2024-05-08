import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormHelperText, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { newNode } from '../utils/ideaTool';

export const CreateQuestion = ({ open, onClose, ws }) => {
    const name = localStorage.getItem('name');
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [loading, setLoading] = useState(false);
    const nodeDefault = {
      title: "",
      content: "",
      tags: "question",
      author: name,
      groupId: sessionStorage.getItem('groupId')
    }
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
        await newNode(ideaData, sessionStorage.getItem('activityId'),ws);
        alert("新增成功");
        onClose(onClose);
        setLoading(false);
        setData(nodeDefault);
        setEditorState(EditorState.createEmpty());
      }
      catch(error){
          alert("新增失敗");
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
          <DialogTitle>新增提問</DialogTitle>
          <Divider variant="middle" />
          <DialogContent>
            <FormControl variant="standard" fullWidth>
              <TextField
                required
                id="standard-required"
                autoFocus
                margin="dense"
                label={"問題標題"}
                type="text"
                name='title'
                value={data.title}
                fullWidth
                variant="standard"
                onChange={handleChange}
                inputProps={{ maxLength: 15 }}
              />
              <FormHelperText id="component-helper-text">
                請為你提問下一個標題，讓其他同學能更快速的了解你想了解什麼！
              </FormHelperText>
            </FormControl>
            <Editor
              editorState={editorState}
              onEditorStateChange={onEditorStateChange}
              wrapperClassName="wrapper-class"
              editorClassName="editor-class"
              toolbarClassName="toolbar-class"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>取消</Button>
            <LoadingButton type='submit' onClick={handleSubmit} loading={loading} loadingPosition="start" variant="contained">送出</LoadingButton>
          </DialogActions>
        </Dialog>
      </>
    );
}
import React, { useEffect } from 'react';
import config from '../config.json';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { styled, Card, CardHeader, CardContent, Typography, CardActions, IconButton } from '@mui/material';
import { Favorite } from '@mui/icons-material';
import { Button } from '@mui/base';

const Item = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#E3DFFD',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.secondary,
}));

const EnterActivity = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme }) => ({
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
}));

export default function ActivityCard({ activity }) {
    const navigate = useNavigate();
    const formatTimestamp = (timestamp) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            //   second: 'numeric',
            hour12: false,
        }).format(new Date(timestamp));
    };

    const handleEnter = async (e) => {
        e.preventDefault();
        localStorage.setItem('activityId', activity.ActivityGroup.Activity.id);
        navigate("/forum");
    };


    // console.log(`groupName: ${activity.ActivityGroup.Group.groupName}`);
    return (
    <div>
        <Item>
            <CardHeader
                title={activity.ActivityGroup.Activity.title}      
                subheader={activity.ActivityGroup.Group.groupName ?? ''}   
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {`${formatTimestamp(activity.ActivityGroup.Activity.startDate)} ~ ${formatTimestamp(activity.ActivityGroup.Activity.endDate)}`}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <Favorite />
                </IconButton>
                <EnterActivity>
                    <Button className='enter-activity-button' onClick={handleEnter}>
                        進入課程
                    </Button>
                </EnterActivity>
            </CardActions>
        </Item>
    </div>
  );
}
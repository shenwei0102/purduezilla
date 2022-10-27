import React, { useState, useEffect } from 'react';
import {Route, Link, Routes, useParams} from 'react-router-dom'; 

import NavBar from '../components/NavBar';
import AddTask from '../components/AddTask';
import LoadTasks from '../components/LoadTasks';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import FixedSizeList from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import WorkIcon from '@mui/icons-material/Work';
import AddIcon from '@mui/icons-material/Add';

import apiFunctions from '../firebase/api';
import { ref, onValue } from "firebase/database";
import ProjectDashboard from '../components/ProjectDashboard';
import { useNavigate } from "react-router-dom";

const Projects = () => {
    const {id} = useParams();
    console.log("parameters: " + id);

    const theme = createTheme();
    const [taskListarr, setTaskListArr] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [project, setProject] = useState('');
    const navigate = useNavigate();


    const handleClickOpen = () => {

    };

    useEffect(() => {
        console.log("reload")
        fetchData()
    }, []);

    const fetchData = (event) => {
        setTaskListArr([])
        console.log("fetched hello: " + id)
        // Update the document title using the browser API
        // const response = onValue(await ref(apiFunctions.db, 'tasks/'), (response))
        // console.log("response: " + response)
        if ( id === null ) {

        }
        else {
            try {
                onValue(ref(apiFunctions.db, 'tasks/'), (snapshot) => {
                    const taskTemp = []
        
                    snapshot.forEach(function(child) {
                        const task = child.val()
                        if (task.projectId === id) {
                            taskTemp.push([task, child.key])
                        }
                    })
    
                    setTaskListArr(taskTemp)
                })
    
                // set project name
                onValue(ref(apiFunctions.db, "projects/" + id), (snapshot) => {
                    setProject(snapshot.val().name)
                });
    
                if (taskListarr.length !== 0) {
                    setLoading(false)
                }
            }
            catch {
                // if there is no internet
            }
        }

        setLoading(false)
        console.log("taskListarr: " + taskListarr.length)
        return true;
    };

    const handleTask = (event) => {
        if (event.currentTarget.id !== "addtask") {
            console.log("eventid: " + event.currentTarget.id)
            navigate('/task/'+event.currentTarget.id);
        }
        else {
            navigate('/newtask/'+id);
        }
    }

    if (id === undefined) {
        return (
            <div>
                <NavBar></NavBar>
                <ProjectDashboard></ProjectDashboard>
            </div>
        );
    }
    else {
        return (
            <div> 
                <NavBar></NavBar>
                <ThemeProvider theme={theme}>
                    <Container component="main">
                        <Box sx={{ mt: 6 }} display="flex" style={{textAlign: "center"}}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={50} sm={12}>
                                    <FixedSizeList sx={{border: 1, borderColor:'black',maxHeight:600, overflowY:'auto',flexGrow: 1,
            flexDirection:"column",}} height={400}>
                                        <ListSubheader><h2>{project}</h2></ListSubheader>
                                            { taskListarr && taskListarr.length != 0 ? taskListarr.map((data) => {
                                                return (
                                                <div key={data.key}>
                                                <Button onClick={handleTask} id={data[1]} sx={{ height: '100%', width: '100%'}}>
                                                    <ListItem>
                                                        <ListItemAvatar>
                                                            <WorkIcon color="grey"/>
                                                        </ListItemAvatar>
                                                        <ListItemText primary={data[0].name} secondary={data[0].description}/>
                                                    </ListItem>
                                                </Button>
                                                <Divider />
                                            </div>   
                                            )}): "There are no tasks!" }
                                            <Button onClick={handleTask} id={"addtask"} sx={{ height: '80%', width: '100%'}}>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <AddIcon color="grey"/>
                                                </ListItemAvatar>
                                                <ListItemText primary={"Add Task"}/>
                                            </ListItem>
                                        </Button>
                                    </FixedSizeList>
                                </Grid>
                            </Grid>
                        </Box>
                    </Container>
                </ThemeProvider>
                {/* <LoadTasks></LoadTasks> */}
                </div>
        );
        
    }
    
}

export default Projects;
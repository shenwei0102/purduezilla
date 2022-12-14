import React, { useEffect, useState } from "react";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormHelperText from '@mui/material/FormHelperText';
import NavBar from '../components/NavBar';
import { useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar';

import { ref, onValue } from "firebase/database";
import apiFunctions from '../firebase/api';

const theme = createTheme();

export default function NewProject() {
    const [name, setName] = useState('');
    const [description, setDesc] = useState('');
    const [owner, setOwner] = React.useState([]);
    const [member, setMember] = React.useState([]);
    const [viewer, setViewer] = React.useState([]);

    const [memberId, setMemberId] = React.useState([]);
    const [ownerId, setOwnerId] = React.useState([]);
    const [viewerId, setViewerId] = React.useState([]);

    const [userList, setUserList] = useState([]);
    const navigate = useNavigate();

    const handleNameChange = event => {
        setName(event.target.value)
    };

    const handleDescChange = event => {
        setDesc(event.target.value)
    };

    const handleMemberChange = (event) => {
        setMember(event.target.value);
    };

    const handleOwnerChange = (event) => {
        setOwner(event.target.value);
    };

    const handleViewerChange = (event) => {
        setViewer(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        // console.log("submitted")

        const memberId = ([]);
        const ownerId = ([]);

        member.forEach(function(memberTemp) {
            memberId.push(memberTemp[1])
        })

        owner.forEach(function(ownerTemp) {
            ownerId.push(ownerTemp[1])
        })

        viewer.forEach(function(viewerTemp) {
            viewerId.push(viewerTemp[1])
        })

        let createNewGroup = await apiFunctions.createNewGroup(
            name, description, ownerId, memberId, viewerId
            )

        const ret = createNewGroup
        if (ret) {
            alert(name + " Group Created!");
            navigate('/group/'+ ret);
        } else {
        // perform error UI like highlighting textfield to red
            alert("Group Creation Failed.")
        }
    };

    useEffect(() => {
        // console.log("reload")
        fetchData()
    }, []);

    const fetchData = async(event) => {
        // user
        try {
            
            await onValue(ref(apiFunctions.db, 'users/'), (snapshot) => {
                const userTemp = []
    
                snapshot.forEach(function(child) {
                    const user = child.val()
                    // console.log("current value: " + user.firstName + " " + user.lastName)
                    userTemp.push([user, child.key])
                })

                setUserList(userTemp)
            })
            console.log("userList: " + userList)
        }
        catch {
            // if there is no internet
        }
    }

    return(
        <div>
            <NavBar></NavBar>
                <ThemeProvider theme={theme}>
                    <Container component="main" maxWidth="sm">
                    <Box component="form" onSubmit={handleSubmit} Validate sx={{ mt: 3 }}>
                        <h2 align='center' 
                        sx={{
                            marginTop:10,
                            marginBottom:-5,
                        }}>New Group</h2>
                            <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                            >                                
                            <Box component="form" sx={{ mt: 4 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={50} sm={12}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                autoComplete="given-name"
                                                name="groupName"
                                                onChange={handleNameChange}
                                                required
                                                fullWidth
                                                id="groupName"
                                                label="Group Name"
                                                autoFocus
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                        required
                                        fullWidth
                                        multiline
                                        onChange={handleDescChange}
                                        rows={4}
                                        id="groupDescription"
                                        label="Group Description"
                                        name="groupDescription"
                                        />
                                    </Grid>                                    
                                </Grid>

                                <br></br>
                                <Divider>OWNERS</Divider>
                                <br></br>

                                <FormControl xs={12} fullWidth>
                                    <InputLabel id="memberLabel">Owners</InputLabel>
                                    <Select
                                        multiple
                                        defaultValue={10}
                                        value={owner}
                                        required
                                        onChange={handleOwnerChange}
                                        label="ownerLabel"
                                        textOverflow="ellipsis"
                                        overflow="hidden"
                                        id="ownerLabel"
                                        renderValue={(owner) => (
                                        <div>
                                            {owner.map((data) => (
                                                <Chip 
                                                key={data[1]} 
                                                avatar={<Avatar sx={{ width: 24, height: 24 }}> {data[0].firstName[0]}</Avatar>}
                                                label={data[0].firstName + " " + data[0].lastName} 
                                                sx={{marginRight:1,}}/>
                                            ))}
                                        </div>
                                        )}
                                    >
                                        { userList && userList.length != 0 ? userList.map((data) => 
                                                    <MenuItem value={data}>{data[0].firstName + " " + data[0].lastName}</MenuItem>
                                                ): <MenuItem value={0}>New User</MenuItem> }
                                    </Select>
                                    <FormHelperText>Select the team owners of this project.</FormHelperText>
                                </FormControl>

                                <br></br>
                                <br></br>
                                <Divider>MEMBERS</Divider>
                                <br></br>

                                <FormControl xs={12} fullWidth>
                                    <InputLabel id="memberLabel">Members</InputLabel>
                                    <Select
                                        multiple
                                        defaultValue={10}
                                        value={member}
                                        onChange={handleMemberChange}
                                        label="memberLabel"
                                        textOverflow="ellipsis"
                                        overflow="hidden"
                                        id="memberLabel"
                                        renderValue={(member) => (
                                            <div>
                                            {member.map((data) => (
                                                <Chip 
                                                key={data[1]} 
                                                avatar={<Avatar sx={{ width: 24, height: 24 }}> {data[0].firstName[0]}</Avatar>}
                                                label={data[0].firstName + " " + data[0].lastName} 
                                                sx={{marginRight:1,}}/>
                                            ))}
                                            </div>
                                        )}
                                    >
                                        { userList && userList.length != 0 ? userList.map((data) => 
                                                    <MenuItem value={data} id={data}>{data[0].firstName + " " + data[0].lastName}</MenuItem>
                                                ): <MenuItem value={0}>New User</MenuItem> }
                                    </Select>
                                    <FormHelperText>Select the team members of this project.</FormHelperText>
                                </FormControl>

                                <br></br>
                                <br></br>
                                <Divider>Viewers</Divider>
                                <br></br>

                                <FormControl xs={12} fullWidth>
                                    <InputLabel id="viewerLabel">Viewers</InputLabel>
                                    <Select
                                        multiple
                                        defaultValue={10}
                                        value={viewer}
                                        onChange={handleViewerChange}
                                        label="viewerLabel"
                                        textOverflow="ellipsis"
                                        overflow="hidden"
                                        id="viewerLabel"
                                        renderValue={(viewer) => (
                                            <div>
                                            {viewer.map((data) => (
                                                <Chip 
                                                key={data[1]} 
                                                avatar={<Avatar sx={{ width: 24, height: 24 }}> {data[0].firstName[0]}</Avatar>}
                                                label={data[0].firstName + " " + data[0].lastName} 
                                                sx={{marginRight:1,}}/>
                                            ))}
                                            </div>
                                        )}
                                    >
                                        { userList && userList.length != 0 ? userList.map((data) => 
                                                    <MenuItem value={data} id={data}>{data[0].firstName + " " + data[0].lastName}</MenuItem>
                                                ): <MenuItem value={0}>New User</MenuItem> }
                                    </Select>
                                    <FormHelperText>Select the members who can view this project.</FormHelperText>
                                </FormControl>
                                </Box>
                            </Box>
                            <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    >
                                Add Project
                                </Button>
                        </Box>
                    </Container>
             </ThemeProvider>
        </div>
    );
}
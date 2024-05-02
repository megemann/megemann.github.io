import s from './home.style';
import * as React from 'react';
import { Txt } from '../../Components/Txt/Txt';
import { Box, Button, Divider, IconButton, Stack } from '@mui/material';
import profilePic from '../../assets/ProfilePic.jpg';
import umassLogo from '../../assets/UmassLogo.png';
import { ProjectData } from '../../ProjectData';
import TheDefineHotline from "../../assets/TheDefineHotline.png";
import utrition from "../../assets/Utrition.png";
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import { useNavigate } from 'react-router-dom';

const images = {
    The_Define_Hotline: TheDefineHotline,
    Utrition: utrition,
}

export default function Home() {

    const [menu, setMenu] = React.useState(false);

    const nav = useNavigate();

    function openInNewTab(url) {
        window.open(url, '_blank').focus();
    }

    return (
        <div style={s.container}>
            <Stack sx={{ justifyContent:"space-between", margin: "3%"}} direction="row">
                <Stack 
                direction="row" 
                alignItems="center" 
                spacing={2} 
                style={{border: "1px solid white", borderRadius: "5px", boxShadow: "10px 16px 30px 0px rgba(0,0,0,0.60)"}}
                >
                    
                    { ((menu && 
                    <>
                        <Divider orientation="vertical" flexItem color="#2E2C31"/>
                        <Button sx={s.menuItem} onClick={() => setMenu(false)}><Txt style={s.menuButtonText}>Less</Txt></Button>
                        <Divider orientation="vertical" flexItem color="white"/>
                        <Button sx={s.menuItem} onClick={() => nav("/projects")}><Txt style={s.menuButtonText}>All Projects</Txt></Button>
                        <Divider orientation="vertical" flexItem color="white"/>
                        <Button sx={s.menuItem} onClick={() => nav("/aboutme")}><Txt style={s.menuButtonText}>About me</Txt></Button>
                        <Divider orientation="vertical" flexItem color="#2E2C31"/>
                    </>
                    ) || <>
                        <Divider orientation="vertical" flexItem color="#2E2C31"/>
                        <Button sx={s.menuButton} onClick={() => setMenu(true)}><Txt style={s.menuButtonText}>More</Txt></Button>
                        <Divider orientation="vertical" flexItem color="#2E2C31"/>
                    </>)

                    }
                </Stack>
                <Stack direction="row" alignItems="center">
                    <Txt> CONTACT: </Txt>
                    <IconButton onClick={() => openInNewTab("https://github.com/megemann")} sx={s.iconbutton} >
                        <GitHubIcon style={s.icon}/>
                    </IconButton>
                    <IconButton onClick={() => openInNewTab("https://www.instagram.com/austinfairbanks05")} sx={s.iconbutton} >
                        <InstagramIcon sx={s.icon}/>
                    </IconButton>
                    <IconButton onClick={() => openInNewTab("https://www.linkedin.com/in/ajf2005")} sx={s.iconbutton} >
                        <LinkedInIcon sx={s.icon}/>
                    </IconButton>
                    <IconButton onClick={() =>   {navigator.clipboard.writeText("austinfairbanks05@gmail.com"); alert("Email copied to clipboard!")}} sx={s.iconbutton} >
                        <EmailIcon sx={s.icon}/>
                    </IconButton>
                </Stack>
            </Stack>
            <Divider color="white" sx={{width: "90vw", alignSelf: "center", marginTop: "-3vh"}}/>
            <Txt style={s.introduction}> Hello! </Txt>
            <Txt style={s.introductionII}> My name is Austin! </Txt>
            <Txt style={s.welcome}> Welcome to my page! {":)"} Stay as long as you'd like. </Txt>
            <Stack style={s.umass}>
                <img src={umassLogo} style={{width: "238px", marginBottom: "5%"}} alt='umass logo' />
                <Txt style={{textAlign: "center"}}> I am an aspiring Software Engineer from New York currently attending </Txt>
                <Txt style={{color: "#e64e4e", textAlign: "center"}}>the University of Massachusetts Amherst! (Class of 2027)</Txt>
            </Stack>
            <img src={profilePic} style={s.pfpic} alt='profile' />
            <Stack style={s.scroll}>
                <Txt> SCROLL FOR MORE </Txt>
                <Box sx={s.horizontalScroll}/>
                <Box sx={s.verticalScroll}/>
            </Stack>
            
            <Box style={{marginTop: "100vh", paddingLeft: "5%"}}>
                <Box style={s.divider}/>
                <Txt style={s.highlights}> Highlights: </Txt>
                {
                    ProjectData.map((project, index) => {
                        return ( project.highlight && (
                            <div style={{paddingLeft: "5%"}}>
                                <Stack direction={"row"} spacing={2}>
                                    <Stack style={s.projectContainer} key={index} spacing={2}>   
                                        <Txt style={s.ptitle}> {project.title} - </Txt>
                                        <Txt style={s.pdescription}> {project.description} </Txt>
                                        <Button style={s.pbutton} onClick={() => nav(`/project/${project.key}`)}> LEARN MORE </Button>
                                    </Stack>
                                    <img style={s.pimg} src={images[project.key]}  alt={project.key}/>
                                </Stack>
                                <Box style={s.divider}/>
                            </div>
                            ) 
                        )
                    })
                }
            </Box>
            <Stack direction={"row"} spacing={2} alignItems={"center"} style={{marginTop: "5%"}}>
                <Box style={s.smalldivider}/>
                <Txt style={{fontSize: "15px", width: "40vw"}}> Copyright 2024 Austin Fairbanks; Contact at ajfairbanks@gmail.com</Txt>
                <Box style={s.smalldivider}/>
            </Stack>

        </div>
    )
}
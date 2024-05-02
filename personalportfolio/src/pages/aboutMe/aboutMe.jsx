import s from './aboutMe.style';
import * as React from 'react';
import { Txt } from '../../Components/Txt/Txt';
import { Button, Divider, Stack } from '@mui/material';
import golf from '../../assets/golf.png';
import travel from '../../assets/travel.jpeg';
import { useNavigate } from 'react-router-dom';

export default function AboutMe() {

    const nav = useNavigate();

    return (
        <div style={s.container}>
            <Button onClick={() => nav("/")} style={s.backBtn}>{"< Home"}</Button>
            <Stack style={{height:"92vh"}} direction={"row"} spacing={2} divider={<Divider color="white" flexItem orientation='vertical'/>}>
                <Stack spacing={2} divider={<Divider color="white" flexItem />}>
                    <Txt style={s.title}><b>About Me:</b></Txt>
                    <Txt style={s.body}>Hello! I am currently attending UMass Amherst Majoring in Computer Science.
                    Right now, I am experienced in Web Development, Native Development, and a little bit of Back end development. I also participated in two years of 
                    First Tech Challenge, a robotics 'contest' for High Schoolers. Aside from CS, I enjoy excercising, playing golf, and traveling the world. 
                    </Txt>
                    <Stack>
                        <Txt style={{color: "#e64e4e"}}><b>Job Experience:</b></Txt>
                        <Txt>Intramural Manager, UMass Amherst: 5/2024 - Present</Txt>
                        <Txt>Intramural Referee, UMass Amherst: 10/2023 - 5/2024</Txt>
                    </Stack>
                    <Stack>
                        <Txt style={{color: "#e64e4e"}}><b>Skills:</b></Txt>
                        <Txt>Native Development</Txt>
                        <Txt>Python</Txt>
                        <Txt>Java</Txt>
                        <Txt>Web Development</Txt>
                        <Txt>Back End Development</Txt>
                    </Stack>        
                </Stack>
                <Stack spacing={5} justifyContent={"center"}>
                    <img src={golf} style={s.golf} alt='golf'/>
                    <img src={travel} style={s.travel} alt='travel'/>
                </Stack>
            </Stack>
            
        </div>
    );
}
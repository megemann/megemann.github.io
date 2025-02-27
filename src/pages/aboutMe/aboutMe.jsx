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
                    <Txt style={s.body}>Hello! I am currently attending UMass Amherst Majoring in Computer Science. My passion is in machine learning, where I have some experience in unsupervised
                    learning as well as deep learning. Additionally, my experiences with machine learning have lead to practice with real world dataset manipulation.
                    I also have experimented with Web Development, Native Development, and Back End development. I also participated in two years of 
                    First Tech Challenge, a long term robotics 'contest' for High Schoolers. Aside from CS, I enjoy excercising, playing golf, and traveling the world. 
                    </Txt>
                    <Stack>
                        <Txt style={{color: "#e64e4e"}}><b>Job Experience:</b></Txt>
                        <Txt> ML Intern, on assignment at Corning Inc. through Magnit: 07/2024 - 08/2024</Txt>
                        <Txt>Intramural Manager, UMass Amherst: 5/2024 - Present</Txt>
                        <Txt>Intramural Referee, UMass Amherst: 10/2023 - 5/2024</Txt>
                    </Stack>
                    <Stack>
                        <Txt style={{color: "#e64e4e"}}><b>Skills:</b></Txt>
                        <Txt>Deep Learning / Neural Networks</Txt>
                        <Txt>Keras, Tensorflow, Pytorch</Txt>
                        <Txt>Python, Numpy, Matplotlib</Txt>
                        <Txt>Java</Txt>
                        <Txt>Web Development</Txt>
                        <Txt>Back End Development</Txt>
                        <Txt>Database Management (SQL)</Txt>
                        <Txt>Native Development</Txt>
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
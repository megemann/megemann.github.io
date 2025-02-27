import s from "./projectList.style";
import * as React from 'react';
import { Txt } from '../../Components/Txt/Txt';
import { Button, Divider, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ProjectData } from '../../ProjectData';

export default function ProjectList() {

    const nav = useNavigate();

    return (
        <div style={s.container}>
            <Button onClick={() => nav("/")} style={s.backBtn}>{"< Home"}</Button>
            <Stack spacing={2} sx={s.list} width={"96%"} divider={<Divider color="white" />}>
                <Stack spacing={2} direction="row" divider={<Divider color="white" orientation="vertical" variant="middle" />}>
                    <Txt style={s.title}>Project Title</Txt>
                    <Txt style={s.startdate}>Start Date</Txt>
                    <Txt style={s.enddate}>End Date</Txt>
                    <Txt style={s.link}>Link</Txt>
                    <Txt style={s.skills}>Skills</Txt>
                </Stack>
            {
                ProjectData.map((project) => {
                    return (
                        <Stack spacing={2} direction="row" divider={<Divider color="white" orientation="vertical" variant="middle" flexItem />}>
                            <Txt style={s.title} onClick={() => nav(`/project/${project.key}`)}><u>{project.title}</u></Txt>
                            <Txt style={s.startdate}>{project.date}</Txt>
                            <Txt style={s.enddate}>{project.lastUpdate}</Txt>
                            <Button style={{minWidth: "10%"}} onClick={() => window.open(project.link, "_blank")}><Txt style={s.link}><u>Link</u></Txt></Button>
                            <Txt style={s.skills}>{(project.skills.join(", ")).length > 45 ? (project.skills.join(", ")).slice(0, 45) + "..." : (project.skills.join(", "))}</Txt>
                        </Stack>
                );
                })
            }
            </Stack>
        </div>
    )
}
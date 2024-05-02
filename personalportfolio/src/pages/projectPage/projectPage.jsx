import s from './projectPage.style';
import * as React from 'react';
import { Txt } from '../../Components/Txt/Txt';
import { Button, Stack, Divider } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectData } from '../../ProjectData';
import TheDefineHotline from "../../assets/TheDefineHotline.png";
import utrition from "../../assets/Utrition.png";
import MinuteMunch from "../../assets/MinuteMunch.png";
import NoImage from "../../assets/NoImage.png";

const images = {
    The_Define_Hotline: TheDefineHotline,
    Utrition: utrition,
    Minute_Munch: MinuteMunch,
    Personal_Portfolio: NoImage,
}

export default function ProjectPage() {

    const nav  = useNavigate();
    const { projectKey } = useParams();

    const [project, setProject] = React.useState({
        title: '',
        description: '',
        link: '',
        data: '',
        lastUpdate: '',
        skills: [],
        highlight: false
    });

    React.useEffect(() => {
        for (let i = 0; i < ProjectData.length; i++) {
            if (ProjectData[i].key === projectKey) {
                setProject(ProjectData[i]);
                break;
            }
        }
    }, [projectKey])
    
    return (
        <div style={s.container}>
            <Button onClick={() => nav("/")} style={s.backBtn} >{"< Home"}</Button>
            <Stack direction={"row"} style={{alignItems: "center", marginTop: "-7vh"}} divider={<Divider orientation='vertical' color="white" style={{marginBottom: "10%", marginTop: "10%"}} />}>
                <Stack spacing={4} style={{padding: "3%", width: "60%"}} divider={<Divider color="white" style={{marginRight: "10%", marginLeft: "10%"}} />}>
                    <Txt style={s.title}>{project.title}</Txt>
                    <Txt style={s.description}>{project.description}</Txt>
                    <Txt style={s.dates}>Dates: {project.date}-{project.lastUpdate}</Txt>
                    <Txt style={s.skills}>Skills: {project.skills.join(', ')}</Txt>
                    <Button variant='outlined' style={s.link} onClick={() => window.open(project.link, '_blank')}>Learn More</Button>
                </Stack>
                <img style={s.image} src={images[project.key]} alt={project.key} />
            </Stack>

        </div>
    )
}
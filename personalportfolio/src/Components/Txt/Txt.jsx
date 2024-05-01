import { Typography } from "@mui/material";

const styles = {
    txt: {
        color:"white",
        fontSize: "30px",
        fontFamily: 'Flat',
    }
}


export function Txt({ children, style, ...restProps }) {
    return (
        <Typography
            sx={[styles.txt, style]}
            {...restProps}
        >
            {children}
        </Typography>
    );
}
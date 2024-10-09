const s = {
    container: {
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        backgroundColor: "#2E2C31",
        flexDirection: "column",
        '@media (max-width: 768px)': {
            padding: '5%',
        },
    },
    backBtn: {
        width: "5vw",
        color: "red",
        marginTop: "1%",
        '@media (max-width: 768px)': {
            width: "10vw",
        },
    },
    title: {
        fontSize: "80px",
        color: "#0096ff",
        '@media (max-width: 768px)': {
            fontSize: "40px",
        },
    },
    description: {
        fontSize: "20px",
        color: "#ffffff",
        marginTop: "2%",
        '@media (max-width: 768px)': {
            fontSize: "16px",
        },
    },
    link: {
        fontSize: "18px",
        color: "#0096ff",
        textDecoration: "underline",
        cursor: "pointer",
        '@media (max-width: 768px)': {
            fontSize: "14px",
        },
    },
    dates: {
        color: "#e64e4e",
        fontSize: "18px",
        '@media (max-width: 768px)': {
            fontSize: "14px",
        },
    },
    skills: {
        fontSize: "18px",
        color: "#ffffff",
        marginTop: "2%",
        '@media (max-width: 768px)': {
            fontSize: "14px",
        },
    },
    image: {
        width: "30%",
        height: "30%",
        marginTop: "2%",
        '@media (max-width: 768px)': {
            width: "60%",
            height: "auto",
        },
    },
};

export default s;
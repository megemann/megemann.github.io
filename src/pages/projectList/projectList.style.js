const s = {
    container: {
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        backgroundColor: "#2E2C31",
        flexDirection: "column",
        '@media (max-width: 768px)': {
            minHeight: '100vh',
            width: '100%',
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
        minWidth: "20%",
        color: "#0096ff",
        cursor: "pointer",
        '@media (max-width: 768px)': {
            minWidth: "40%",
            fontSize: "16px",
        },
    },
    link: {
        minWidth: "10%",
        textAlign: "center",
        color: "#e64e4e",
        '@media (max-width: 768px)': {
            minWidth: "20%",
            fontSize: "14px",
        },
    },
    skills: {
        minWidth: "40%",
        '@media (max-width: 768px)': {
            minWidth: "70%",
            fontSize: "14px",
        },
    },
    startdate: {
        minWidth: "10%",
        textAlign: "center",
        '@media (max-width: 768px)': {
            minWidth: "20%",
            fontSize: "14px",
        },
    },
    enddate: {
        minWidth: "10%",
        textAlign: "center",
        '@media (max-width: 768px)': {
            minWidth: "20%",
            fontSize: "14px",
        },
    },
    list: {
        margin: "1%", 
        padding: "0.5%", 
        border: "1px solid white", 
        borderRadius: "5px", 
        boxShadow: "10px 16px 30px 0px rgba(0,0,0,0.60)",
        '@media (max-width: 768px)': {
            padding: "2%",
            boxShadow: "5px 8px 15px 0px rgba(0,0,0,0.60)",
        },
    }
}

export default s;

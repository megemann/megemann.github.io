const s = {
    container: {
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        backgroundColor: "#2E2C31",
        flexDirection: "column",
        overflowX: 'hidden',
    },
    backBtn: {
        width: "auto",
        color: "#e64e4e",
        marginTop: "1%",
        marginLeft: "1%",
        fontWeight: "bold",
        transition: "all 0.3s ease",
        '&:hover': {
            color: "#ff6b6b",
            transform: 'scale(1.05)',
        },
        '@media (max-width: 900px)': {
            fontSize: "14px",
        },
    },
    title: {
        minWidth: "20%",
        color: "#0096ff",
        cursor: "pointer",
        fontWeight: "bold",
        transition: "all 0.3s ease",
        '&:hover': {
            textDecoration: "underline",
            color: "#007acc",
        },
        '@media (max-width: 1200px)': {
            minWidth: "25%",
            fontSize: "16px",
        },
        '@media (max-width: 900px)': {
            minWidth: "30%",
            fontSize: "14px",
        },
    },
    link: {
        minWidth: "10%",
        textAlign: "center",
        color: "#e64e4e",
        fontWeight: "bold",
        transition: "all 0.3s ease",
        '&:hover': {
            color: "#ff6b6b",
        },
        '@media (max-width: 1200px)': {
            minWidth: "15%",
            fontSize: "16px",
        },
        '@media (max-width: 900px)': {
            minWidth: "20%",
            fontSize: "14px",
        },
    },
    skills: {
        minWidth: "40%",
        transition: "all 0.3s ease",
        '@media (max-width: 1200px)': {
            minWidth: "30%",
            fontSize: "16px",
        },
        '@media (max-width: 900px)': {
            minWidth: "20%",
            fontSize: "14px",
        },
    },
    startdate: {
        minWidth: "10%",
        textAlign: "center",
        transition: "all 0.3s ease",
        '@media (max-width: 1200px)': {
            minWidth: "15%",
            fontSize: "16px",
        },
        '@media (max-width: 900px)': {
            minWidth: "15%",
            fontSize: "14px",
        },
    },
    enddate: {
        minWidth: "10%",
        textAlign: "center",
        transition: "all 0.3s ease",
        '@media (max-width: 1200px)': {
            minWidth: "15%",
            fontSize: "16px",
        },
        '@media (max-width: 900px)': {
            minWidth: "15%",
            fontSize: "14px",
        },
    },
    list: {
        margin: "1%", 
        padding: "1.5%", 
        border: "1px solid white", 
        borderRadius: "10px", 
        boxShadow: "10px 16px 30px 0px rgba(0,0,0,0.60)",
        transition: "all 0.3s ease",
        '@media (max-width: 1200px)': {
            padding: "2%",
            margin: "2%",
        },
        '@media (max-width: 900px)': {
            padding: "3%",
            margin: "3%",
            boxShadow: "5px 8px 15px 0px rgba(0,0,0,0.60)",
        },
    }
}

export default s;

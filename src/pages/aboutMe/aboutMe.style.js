const s = {
    container: {
        minHeight: '100vh',
        width: '97%',
        display: 'flex',
        backgroundColor: "#2E2C31",
        flexDirection: "column",
        paddingLeft: "3%",
        overflowX: 'hidden',
    },
    golf: {
        width: "70%",
        border: "3px solid white",
        borderRadius: "10px",
        boxShadow: "4px 4px 15px rgba(0, 0, 0, 0.3)",
        transition: "all 0.3s ease",
        '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: "6px 6px 20px rgba(0, 0, 0, 0.4)",
        },
        '@media (max-width: 900px)': {
            width: "80%",
        },
    },
    travel: {
        width: "70%",
        border: "3px solid white",
        borderRadius: "10px",
        boxShadow: "4px 4px 15px rgba(0, 0, 0, 0.3)",
        transition: "all 0.3s ease",
        '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: "6px 6px 20px rgba(0, 0, 0, 0.4)",
        },
        '@media (max-width: 900px)': {
            width: "80%",
        },
    },
    title: {
        fontSize: "80px",
        color: "#0096ff",
        fontWeight: "bold",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        transition: "all 0.3s ease",
        '@media (max-width: 1200px)': {
            fontSize: "65px",
        },
        '@media (max-width: 900px)': {
            fontSize: "45px",
        },
    },
    body: {
        fontSize: "18px",
        lineHeight: "1.6",
        transition: "all 0.3s ease",
        '@media (max-width: 900px)': {
            fontSize: "16px",
        },
    },
    backBtn: {
        width: "auto",
        color: "#e64e4e",
        marginTop: "1%",
        marginLeft: "-2%",
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
    skillTitle: {
        color: "#e64e4e",
        fontWeight: "bold",
        fontSize: "24px",
        marginBottom: "10px",
        transition: "all 0.3s ease",
        '@media (max-width: 900px)': {
            fontSize: "20px",
        },
    },
    skillItem: {
        fontSize: "18px",
        marginLeft: "20px",
        lineHeight: "1.8",
        transition: "all 0.3s ease",
        '@media (max-width: 900px)': {
            fontSize: "16px",
            marginLeft: "10px",
        },
    },
}

export default s;
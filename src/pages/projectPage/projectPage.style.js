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
        fontSize: "80px",
        color: "#0096ff",
        fontWeight: "bold",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        transition: "all 0.3s ease",
        '@media (max-width: 1200px)': {
            fontSize: "60px",
        },
        '@media (max-width: 900px)': {
            fontSize: "40px",
        },
    },
    description: {
        fontSize: "20px",
        color: "#ffffff",
        marginTop: "2%",
        lineHeight: "1.6",
        transition: "all 0.3s ease",
        '@media (max-width: 1200px)': {
            fontSize: "18px",
        },
        '@media (max-width: 900px)': {
            fontSize: "16px",
        },
    },
    link: {
        fontSize: "18px",
        color: "white",
        backgroundColor: "#0096ff",
        padding: "10px 20px",
        borderRadius: "5px",
        fontWeight: "bold",
        transition: "all 0.3s ease",
        '&:hover': {
            backgroundColor: "#007acc",
            transform: 'scale(1.05)',
        },
        '@media (max-width: 1200px)': {
            fontSize: "16px",
            padding: "8px 16px",
        },
        '@media (max-width: 900px)': {
            fontSize: "14px",
            padding: "6px 12px",
        },
    },
    dates: {
        color: "#e64e4e",
        fontSize: "18px",
        fontWeight: "bold",
        transition: "all 0.3s ease",
        '@media (max-width: 1200px)': {
            fontSize: "16px",
        },
        '@media (max-width: 900px)': {
            fontSize: "14px",
        },
    },
    skills: {
        fontSize: "18px",
        color: "#ffffff",
        marginTop: "2%",
        transition: "all 0.3s ease",
        '@media (max-width: 1200px)': {
            fontSize: "16px",
        },
        '@media (max-width: 900px)': {
            fontSize: "14px",
        },
    },
    image: {
        width: "30%",
        height: "auto",
        marginTop: "2%",
        borderRadius: "15px",
        boxShadow: "4px 4px 15px rgba(0, 0, 0, 0.3)",
        transition: "all 0.3s ease",
        '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: "6px 6px 20px rgba(0, 0, 0, 0.4)",
        },
        '@media (max-width: 1200px)': {
            width: "35%",
        },
        '@media (max-width: 900px)': {
            width: "40%",
        },
    },
};

export default s;
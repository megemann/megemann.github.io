const s = {
    container: {
        minHeight: '120vh',
        width: '97%',
        display: 'flex',
        backgroundColor: "#2E2C31",
        flexDirection: "column",
        paddingLeft: "3%",
        '@media (max-width: 768px)': {
            width: '100%',
            paddingLeft: '5%',
        },
    },
    golf: {
        width: "70%",
        border: "3px solid white",
        borderRadius: "5px",
        '@media (max-width: 768px)': {
            width: "90%",
        },
    },
    travel: {
        width: "70%",
        border: "3px solid white",
        borderRadius: "5px",
        '@media (max-width: 768px)': {
            width: "90%",
        },
    },
    title: {
        fontSize: "80px",
        color: "#0096ff",
        '@media (max-width: 768px)': {
            fontSize: "40px",
        },
    },
    backBtn: {
        width: "5vw",
        color: "red",
        marginTop: "1%",
        marginLeft: "-2%",
        '@media (max-width: 768px)': {
            width: "10vw",
            marginLeft: "0",
        },
    },
};

export default s;

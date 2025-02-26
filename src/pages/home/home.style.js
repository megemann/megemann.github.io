const s = {
    container: {
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        backgroundColor: "#2E2C31",
        flexDirection: "column",
    },
    umass: {
        width: "35%",
        alignItems: 'center',
        flexDirection: 'column',
        position: "absolute",
        top: "20vh",
        left: "62%",
        '@media (max-width: 1024px)': {
            width: "60%",
            left: "55%",
        },
        '@media (max-width: 768px)': {
            width: "80%",
            left: "50%",
            top: "15vh",
        },
    },
    icon: {
        width: "3vw",
        height: "3vw",
        color: "white",
        '@media (max-width: 768px)': {
            width: "6vw",
            height: "6vw",
        },
    },
    menuItemText: {
        fontSize: "20px",
        '@media (max-width: 768px)': {
            fontSize: "16px",
        },
    },
    menuButtonText: {
        fontSize: "20px",
        '@media (max-width: 768px)': {
            fontSize: "16px",
        },
    },
    pfpic: {
        width: "25%",
        position: "absolute",
        top: "18vh",
        left: "35vw",
        borderRadius: "40%",
        boxShadow: "6px 20px 31px 7px rgba(0,0,0,0.7)",
        border: "4px solid #ffffff",
        '@media (max-width: 1024px)': {
            width: "35%",
            top: "15vh",
            left: "30vw",
        },
        '@media (max-width: 768px)': {
            width: "50%",
            top: "12vh",
            left: "25vw",
        },
    },
    umasslogo: {
        width: "5%",
        '@media (max-width: 768px)': {
            width: "10%",
        },
    },
    introduction: {
        position: "absolute",
        top: "28vh",
        left: "3vw",
        color: "#0096ff",
        fontSize: "45px",
        width: "30%",
        textAlign: "center",
        '@media (max-width: 1024px)': {
            fontSize: "35px",
            width: "40%",
        },
        '@media (max-width: 768px)': {
            fontSize: "25px",
            width: "80%",
            left: "10vw",
        },
    },
    introductionII: {
        position: "absolute",
        top: "35vh",
        left: "3vw",
        color: "#0096ff",
        fontSize: "45px",
        width: "30%",
        textAlign: "center",
        '@media (max-width: 1024px)': {
            fontSize: "35px",
            width: "40%",
        },
        '@media (max-width: 768px)': {
            fontSize: "25px",
            width: "80%",
            left: "10vw",
        },
    },
    welcome: {
        position: "absolute",
        top: "75vh",
        left: "5vw",
        color: "white",
        fontSize: "35px",
        width: "25%",
        '@media (max-width: 1024px)': {
            fontSize: "28px",
        },
        '@media (max-width: 768px)': {
            fontSize: "20px",
            width: "80%",
            left: "10vw",
        },
    },
    horizontalScroll: {
        height: "0.75px",
        backgroundColor: "white",
        width: "280px",
        '@media (max-width: 768px)': {
            width: "180px",
        },
    },
    verticalScroll: {
        width: "0.75px",
        backgroundColor: "white",
        height: "400px",
        '@media (max-width: 768px)': {
            height: "300px",
        },
    },
    scroll: {
        display: "flex",
        position: "absolute",
        top: "80vh",
        left: "70vw",
        alignItems: "flex-end",
        '@media (max-width: 1024px)': {
            left: "60vw",
        },
        '@media (max-width: 768px)': {
            left: "50vw",
        },
    },
    highlights: {
        color: "#e64e4e",
        fontSize: "70px",
        marginBottom: "3%",
        '@media (max-width: 1024px)': {
            fontSize: "50px",
        },
        '@media (max-width: 768px)': {
            fontSize: "30px",
        },
    },
    projectContainer: {
        width: "60%",
        '@media (max-width: 1024px)': {
            width: "70%",
        },
        '@media (max-width: 768px)': {
            width: "90%",
        },
    },
    ptitle: {
        fontSize: "40px",
        color: "#0096ff",
        '@media (max-width: 1024px)': {
            fontSize: "30px",
        },
        '@media (max-width: 768px)': {
            fontSize: "20px",
        },
    },
    pdescription: {
        paddingLeft: "5%",
        paddingRight: "5%",
        '@media (max-width: 768px)': {
            paddingLeft: "10%",
            paddingRight: "10%",
        },
    },
    plink: {
        fontFamily: "Flat",
        fontSize: "20px",
        color: "#e64e4e",
        paddingLeft: "5%",
        '@media (max-width: 768px)': {
            fontSize: "16px",
        },
    },
    pimg: {
        width: "30%",
        borderRadius: "70px",
        '@media (max-width: 768px)': {
            width: "50%",
        },
    },
    divider: {
        height: "0.75px",
        backgroundColor: "white",
        width: "70vw",
        margin: "3%",
        '@media (max-width: 768px)': {
            width: "80vw",
        },
    },
    smalldivider: {
        height: "0.75px",
        backgroundColor: "white",
        width: "35vw",
        margin: "3%",
        '@media (max-width: 768px)': {
            width: "50vw",
        },
    },
    iconbutton: {
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        marginLeft: "1vw",
        '@media (max-width: 768px)': {
            marginLeft: "2vw",
        },
    }
}

export default s;
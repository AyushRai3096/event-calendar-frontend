import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import logo from '../../assets/logo.png';
import config from '../../config';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    }
}));

function AppbarComponent(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static" style={{background: "#2c3e50"}}>
                <Toolbar>
                    <img
                        src={logo}
                        alt={config.appName}
                    />
                    <Typography variant="h6" className={classes.title}>
                        {config.appName}
                    </Typography>
                    <Button
                        color="inherit"
                        onClick={props.handleLogout}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default AppbarComponent;
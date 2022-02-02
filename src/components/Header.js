import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import appConfig from '../../config.json';
import Avatar from '@mui/material/Avatar';
import { useRouter } from 'next/router';
import Skeleton from '@mui/material/Skeleton';

export function Header(props) {
    const route = useRouter();
    return (
        <Box>
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: appConfig.theme.colors.primary[500],
                    position: 'fixed', 
                    top: 0,   
                }}
            >
                <Toolbar>
                    {props.user ? (
                        <Avatar
                            sx={{
                                border: `2px solid ${appConfig.theme.colors.primary[200]}`,
                                width: 45,
                                height: 45
                            }}
                            alt={props.user}
                            src={`https://github.com/${props.user}.png`}
                        />
                    ) : (
                        <Skeleton 
                            variant="circular" 
                            width={45} 
                            height={45} 
                            sx={{ 
                                bgcolor: `${appConfig.theme.colors.primary[200]}`,
                                border: `2px solid ${appConfig.theme.colors.primary[200]}`,
                            }} />
                    )}
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: 1 }}>
                        AluraCord
                    </Typography>
                    <Button
                        color="inherit"
                        onClick={
                            () => {
                                route.push('/');
                            }}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
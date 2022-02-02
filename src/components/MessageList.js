import * as React from 'react';
import appConfig from '../../config.json';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});

export function MessageList(props) {
    return (
        <>
            {props.messages.map((message) => {
                return (
                    <Paper key={message.id}
                        elevation={0}
                        variant="outlined"
                        onLoad={() => { props.onLoad(); }}
                        sx={{
                            p: 1,
                            margin: 'auto',
                            maxWidth: 500,
                            flexGrow: 1,
                            marginY: 1,
                            border: `1px solid ${appConfig.theme.colors.primary[100]}`
                        }}>
                        <Grid container spacing={5}>
                            <Grid item xs={2} sm={1}>
                                <Grid>
                                    <Avatar alt={message.from} src={`https://github.com/${message.from}.png`} variant='rounded' />
                                </Grid>
                            </Grid>
                            <Grid item xs={10} sm={11} container>
                                <Grid item xs container direction="column" spacing={2}>
                                    <Grid item xs>
                                        <Typography fontWeight="600" variant="subtitle2" component="span" color={appConfig.theme.colors.neutrals[500]}>
                                            {message.from}
                                        </Typography>
                                        <Typography padding="0.3rem" variant="body2" component="span" color={appConfig.theme.colors.neutrals[300]}>
                                            •
                                        </Typography>
                                        <Typography variant="caption" component="span" color={appConfig.theme.colors.neutrals[300]}>
                                            {moment(message.created_at, "YYYY-MM-DDTHH:mm:ss.SSSSSSSSS+ZZ").fromNow()}
                                        </Typography>
                                        <Typography variant="body1" gutterBottom>
                                            {message.text.startsWith(':sticker:') ? (
                                                <Img src={message.text.replace(':sticker:', '')} />
                                            )
                                                : (
                                                    message.text
                                                )}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item xs={1} sm={1}>
                                    <IconButton
                                        aria-label="delete"
                                        size="small"
                                        onClick={() => {
                                            if (Boolean(props.onDeleteClick)) {
                                                props.onDeleteClick(message.id);
                                            }
                                        }}>
                                        <DeleteIcon fontSize="inherit" />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                );
            })}
        </>
    );
}
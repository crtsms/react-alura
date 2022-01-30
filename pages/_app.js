import appConfig from '../config.json';
import * as React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

function GlobalStyle() {
    return (
        <style global jsx>{`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style: none;
      }
      *::-webkit-scrollbar{
        width: 12px;
      }
      *::-webkit-scrollbar-track{
        background: ${appConfig.theme.colors.neutrals['800']};
        border-radius: 10px;
      }

      *::-webkit-scrollbar-thumb{
        background-color:${appConfig.theme.colors.neutrals['300']};
        border-radius:20px;
        border: 3px solid ${appConfig.theme.colors.neutrals['100']}:
        border-radius: 10px;      
      }

      body {
        font-family: 'Open Sans', sans-serif;
      }
      /* App fit Height */ 
      html, body, #__next {
        min-height: 100vh;
        display: flex;
        flex: 1;
      }
      #__next {
        flex: 1;
      }
      #__next > * {
        flex: 1;
      }
      /* ./App fit Height */ 
    `}</style>
    );
  }
  
  export default function CustomApp({ Component, pageProps }) {
    return (
        <React.Fragment>
            <GlobalStyle />
            <CssBaseline />
            <Component {...pageProps} />
        </React.Fragment>
    );
  }
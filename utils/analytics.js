import React from 'react';
import ReactGA from 'react-ga';
import config from '../config/config.dev';

export const initGA = () => {
    console.log('GA init');
    ReactGA.initialize(config.googleAnalyticsKey);
};

export const logPageView = () => {
    console.log(`Logging pageview for ${window.location.pathname}`);
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
};

export const logEvent = (category = '', action = '') => {
    if( category && action) {
        ReactGa.event({ category, action });
    }
};

export const logException = (description = '', fatal = false) => {
    if(description) {
        ReactGA.exception({description, fatal});
    }
};
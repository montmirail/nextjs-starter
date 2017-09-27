import Cookie from 'js-cookie';

const getQueryParams = () => {
    const params = {};
    window.location.href.replace(/([^(?|#)=&]+)(=([^&]*))?/g, ($0, $1, $2, $3) => {
        params[$1] = $3
    });
    return params
};

export const extractInfoFromHash = () => {
    if (!process.browser) {
        return undefined
    }
    const {token, state, redirect } = getQueryParams();
    return {token: token, secret: state, redirect}
};

export const parseRedirect = (redirectQuery) => {
    return redirectQuery.replace(/%2F/g, '/');
};

export const setToken = (token) => {
    if (!process.browser) {
        return
    }
    Cookie.set('jwt', token)
};

export const unsetToken = () => {
    if (!process.browser) {
        return
    }
    Cookie.remove('jwt');
    // to support logging out from all windows
    window.localStorage.setItem('logout', Date.now())
};

export const getUserFromServerCookie = (req) => {
    if (!req.headers.cookie) {
        return undefined
    }
    const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('jwt='));
    if (!jwtCookie) {
        return undefined
    }
    const jwt = jwtCookie.split('=')[1];
    return jwt;
};

export const getUserFromLocalCookie = () => {
    return Cookie.getJSON('jwt');
};

export const setSecret = (secret) => Cookie.set('secret', secret);

export const checkSecret = (secret) => Cookie.get('secret') === secret;
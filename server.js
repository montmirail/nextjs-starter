// Polyfill Node with `Intl` that has data for all locales.
// See: https://formatjs.io/guides/runtime-environments/#server
const IntlPolyfill = require('intl');
Intl.NumberFormat = IntlPolyfill.NumberFormat;
Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;

const express = require('express');
const session = require('express-session');
const {readFileSync} = require('fs');
const {basename} = require('path');
const {createServer} = require('http');
const accepts = require('accepts');
const glob = require('glob');
const next = require('next');
const config = require('./config');

// Load environment variable
require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

// Get the supported languages by looking for translations in the `lang/` dir.
const languages = glob.sync('./lang/*.json').map((f) => basename(f, '.json'))

// We need to expose React Intl's locale data on the request for the user's
// locale. This function will also cache the scripts by lang in memory.
const localeDataCache = new Map();
const getLocaleDataScript = (locale => {
    const lang = locale.split('-')[0];
    if(!localeDataCache.has(lang)) {
        const localeDataFile = require.resolve(`react-intl/locale-data/${lang}`);
        const localeDataScript = readFileSync(localeDataFile, 'utf-8');
        localeDataCache.set(lang, localeDataScript);
    }
    return localeDataCache.get(lang);
});

// We need to load and expose the translations on the request for the user's
// locale. These will only be used in production, in dev the `defaultMessage` in
// each message description in the source code will be used.
const getMessages = (locale) => {
    return require(`./lang/${locale}.json`);
};

app.prepare().then(() => {
    const server = express();


    server.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true
    }));

    server.get('/:lg(\[a-z]{2}\)', (req, res) => {
        switch (req.params.lg) {
            case 'fr':
                req.session.lang = 'fr';
                break;
            default:
                req.session.lang = 'en';
        }
        res.redirect('/');
    });

    server.get('*', (req, res) => {
        const accept = accepts(req);
        const locale = accept.language(dev ? ['en'] : languages);

        req.locale = locale;
        req.localeDataScript = getLocaleDataScript(req.session.lang ? req.session.lang : locale);
        req.messages = dev ? {} : getMessages(req.session.lang ? req.session.lang : locale);

        handle(req, res);

    });

    server.listen(config.port, (err) => {
        if(err){
            throw err;
        } else {
            console.log('> Running on http://localhost:' + config.port)
        }
    })
})
    .catch((ex) => {
        console.error(ex.stack);
        process.exit(1);
    });
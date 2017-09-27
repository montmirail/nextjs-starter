import { Component } from 'react';
import { IntlProvider, addLocaleData, injectIntl } from 'react-intl';
import Router from 'next/router';
import config from '../config';
import withRedux from 'next-redux-wrapper';
import { initStore } from "../utils/store";
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

// Register React Intl's locale data for the user's locale in the browser. This
// locale data was added to the page by `pages/_document.js`. This only happens
// once, on initial page load in the browser.
if (typeof window !== 'undefined' && window.ReactIntlLocaleData) {
    Object.keys(window.ReactIntlLocaleData).forEach((lang) => {
        addLocaleData(window.ReactIntlLocaleData[lang])
    })
}

export default (Page) => {
    class IntlPage extends Component {

        static async getInitialProps (context) {

            let props;
            if (typeof Page.getInitialProps === 'function') {
                props = await Page.getInitialProps(context)
            }

            // Get the `locale` and `messages` from the request object on the server.
            // In the browser, use the same values that the server serialized.
            const { req } = context;
            const { locale, messages } = req || window.__NEXT_DATA__.props.initialProps || window.__NEXT_DATA__.props;

            const now = Date.now();


            return {...props, locale, messages, now };

        }

        constructor(props) {
            super(props);

            this._logout = this._logout.bind(this)
        }

        _logout(e) {
            if (e.key === 'logout') {
                Router.push(`/?logout=${e.newValue}`)
            }
        }

        componentDidMount() {
            window.addEventListener('storage', this._logout, false)
        }

        componentWillUnmount() {
            window.removeEventListener('storage', this._logout, false)
        }

        render() {
            const {locale, messages, now, ...props} = this.props;

            // On inject Intl dans les pages
            const IntlInjectPage = injectIntl(Page);
            const IntlFooter = injectIntl(Footer);
            const IntlHeader = injectIntl(Header);

            return(
                <IntlProvider locale={locale} messages={messages} initialNow={now}>

                    <div className="flex">

                        <IntlHeader />

                        <div className="flex-row">

                            <IntlInjectPage {...props} />

                        </div>

                        <IntlFooter />

                        <style jsx>{`
                            .flex{
                                min-height: 100vh;
                                display: flex;
                                flex-direction: column;
                            }

                            .flex-row{
                                flex-grow: 2;
                                display: flex;
                                flex-direction: row;
                            }

                            .hide{
                                display: none;
                            }

                            @media (min-width: 930px){
                                .hide{
                                display: block;
                            }

                        }
                        `}</style>

                    </div>

                </IntlProvider>
            )
        }
    }

    // We add redux to every page to simulate a real SPA
    return withRedux(initStore, null, null )(IntlPage);
};
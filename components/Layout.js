import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { initGA, logPageView } from '../utils/analytics';
import Head from 'next/head';

const messages = defineMessages({
    title: {
        id: 'title',
        defaultMessage: 'React Intl Next.js Example'
    }
});

class Layout extends React.Component {

    componentDidMount() {
        if(!window.GA_INITIALIZED) {
            initGA();
            window.GA_INITIALIZED = true;
        }
        logPageView();
    }

    render() {
        const { intl, title, children} = this.props;
        return (
            <div>
                <Head>
                    <meta name='viewport' content='width=device-width, initial-scale=1' />
                    <title>{title || intl.formatMessage(messages.title)}</title>
                </Head>

                {children}

            </div>
        )
    }
}

export default injectIntl(Layout);
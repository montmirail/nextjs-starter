import React from 'react'
import {FormattedMessage, FormattedNumber, defineMessages} from 'react-intl'
import Head from 'next/head';
import defaultPage from '../hocs/defaultPage'


const {description} = defineMessages({
    description: {
        id: 'description',
        defaultMessage: 'An example app integrating React Intl with Next.js'
    }
});


const Index = ({intl}) => (
    <section>

        <Head>
            <meta name='description' content={intl.formatMessage(description)} />
        </Head>

        <p>
            <FormattedMessage id='greeting' defaultMessage="Heil Hydra"/>
        </p>

    </section>
);

export default defaultPage(Index);
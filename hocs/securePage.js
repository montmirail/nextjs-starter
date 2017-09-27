import { Component } from 'react';
import Router from 'next/router';

import defaultPage from './defaultPage';
import { getUserFromServerCookie, getUserFromLocalCookie } from '../utils/auth';

const SecuredPage = ( Page ) => (
    class SecurePage extends Component {

        static async getInitialProps ( context ) {

            // We fetch the logged in user
            const loggedUser = process.browser ? getUserFromLocalCookie() : getUserFromServerCookie(context.req);

            // If the user is undefined, we redirect him to the login page
            if(loggedUser === undefined) {
                if(process.browser){
                    Router.push('/login');
                }else {
                    context.res.redirect('/login');
                }
            }

            // We fetch the initial page props
            let props;
            if (typeof Page.getInitialProps === 'function') {
                props = await Page.getInitialProps(context);
            }

            return {
                ...props
            };
        }

        render() {
            return <Page {...this.props}/>
        }
    }
);

export default Page => defaultPage(SecuredPage(Page));
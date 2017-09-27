import PropTypes from 'prop-types';
import defaultPage from '../hocs/defaultPage';
import { FormattedMessage } from 'react-intl'

const Contact = () => (
    <section>
        <FormattedMessage id="contact.title" defaultMessage="Contact Form"/>
    </section>
);

Contact.propTypes = {

};

export default defaultPage(Contact);
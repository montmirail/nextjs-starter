import Link from 'next/link';
import PropTypes from 'prop-types';

const links = [
    { href: '/', text: 'Home' },
    { href: '/profile', text: 'Profile', authRequired: true },
    { href: '/auth/sign-in', text: 'Sign In', anonymousOnly: true },
    { href: '/auth/sign-off', text: 'Sign Off', authRequired: true }
];


const getAllowedLinks = isAuthenticated => links
    .filter(l => !l.authRequired || (l.authRequired && isAuthenticated))
    .filter(l => !isAuthenticated || (isAuthenticated && !l.anonymousOnly));

const Header = ({ isAuthenticated, currentUrl}) => (
    <div>
        {getAllowedLinks(isAuthenticated).map(l => (
            <Link prefetch key={l.href} href={l.href}>
                <a isActive={currentUrl === l.href}>
                    {l.text}
                </a>
            </Link>
        ))}
    </div>
);

Header.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    currentUrl: PropTypes.string.isRequired
};

export default Header;
import LoginPage from './LoginPage.js';
import TerminalPage from './TerminalPage.js';
import { setPage, DEFAULT_LANGUAGE } from './util.js';

const fetchProfile = async () => {
    try {
        const response = await fetch('auth/profile');
        if (!response.ok)
            return null;
        const profile = await response.json();
        return profile;
    }
    catch {
        return null;
    }
};

fetchProfile().then(profile => {
    if (profile) {
        sessionStorage.setItem('first_name', profile.first_name ?? 'unknown user');
        sessionStorage.setItem('language', profile.language ?? DEFAULT_LANGUAGE);
        setPage(new TerminalPage());
    }
    else
        setPage(new LoginPage());
});


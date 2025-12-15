import Cookies from 'js-cookie';

const COOKIE_OPTIONS = {
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict' as const,
    path: '/',
};

export const cookieUtils = {
    // Set token cookie
    setToken: (token: string, rememberMe: boolean = false) => {
        const options = {
            ...COOKIE_OPTIONS,
            expires: rememberMe ? 30 : 7, // 30 days if remember me, 7 days otherwise
        };
        Cookies.set('token', token, options);
    },

    // Get token cookie
    getToken: (): string | undefined => {
        return Cookies.get('token');
    },

    // Set user cookie
    setUser: (user: any, rememberMe: boolean = false) => {
        const options = {
            ...COOKIE_OPTIONS,
            expires: rememberMe ? 30 : 7, // 30 days if remember me, 7 days otherwise
        };
        Cookies.set('user', JSON.stringify(user), options);
    },

    // Get user cookie
    getUser: (): any | null => {
        try {
            const user = Cookies.get('user');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error("Error parsing user cookie:", error);
            Cookies.remove('user', { path: '/' });
            return null;
        }
    },

    // Remove token cookie
    removeToken: () => {
        Cookies.remove('token', { path: '/' });
    },

    // Remove user cookie
    removeUser: () => {
        Cookies.remove('user', { path: '/' });
    },

    // Clear all auth cookies
    clearAuth: () => {
        Cookies.remove('token', { path: '/' });
        Cookies.remove('user', { path: '/' });
    },
};
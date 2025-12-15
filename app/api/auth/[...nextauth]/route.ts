import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Send OAuth data to backend
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          const response = await fetch(`${API_URL}/api/auth/oauth/callback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              provider: account.provider,
              oauthId: account.providerAccountId,
              email: user.email,
              name: user.name,
              profileImage: user.image,
              role: 'customer', // OAuth users default to customer
            }),
          });

          const data = await response.json();

          if (data.success && data.token) {
            // Store token and user in cookies (via client-side)
            // We'll handle this in the redirect
            return true;
          }
          return false;
        } catch (error) {
          console.error('OAuth callback error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.provider = account.provider;
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.provider = token.provider as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // After OAuth, redirect to our custom handler
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/auth/oauth-success`;
    },
  },
});

export { handler as GET, handler as POST };
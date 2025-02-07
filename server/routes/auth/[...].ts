import CredentialsProvider, { CredentialInput } from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'
import type { Account, Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';

interface ArahSmarthomeCredential {
    email: string,
    password: string
    csrfToken: string,
    token: string
}

interface ArahSmarthomeUser extends User {
    username?: string,
}

type ArahSmarthomeSession = Pick<Session, "expires"> & {
    user?: ArahSmarthomeUser
    appId?: string
}

export default NuxtAuthHandler({
    secret: useRuntimeConfig().authSecret,
    providers: [
        // @ts-expect-error
        CredentialsProvider.default({
            id: 'ArahSmarthomeCredentialProvider',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials: ArahSmarthomeCredential, req: any): Promise<User> => {
                return { email: credentials.email, id: credentials.email }
            }
        })
    ],
    callbacks: {
        /* on before signin */
        signIn: async ({ user, account, credentials }: {
            user: ArahSmarthomeUser;
            account: Account | null;
            credentials?: Record<string, CredentialInput> | ArahSmarthomeCredential;
        }) => {
            try {
                if (account?.provider === 'ArahSmarthomeCredentialProvider') {
                    const key = useRuntimeConfig().authSecret;
                    const decryptedtoken = serverUtils.useSmarthome().encryption.decrypt(credentials?.token as string, key)
                    const token = decryptedtoken?.split(/[|]/)[1] || undefined
                    const csrfToken: string | undefined = (credentials?.csrfToken as string)
                    if (decryptedtoken && csrfToken && token === csrfToken) {
                        const maybe_uid = decryptedtoken.split(/[|]/)[0]
                        const { uid } = await serverUtils.useSmarthome().storage.user.getByUid(maybe_uid)
                        user.id = uid
                        // return await Promise.resolve({ user, account }).then(() => true)
                        return await Promise.resolve(user).then(() => true)
                    }
                }
                return 'signin'
            } catch {
                return 'signin'
            }
        },
        /* on redirect to another url */
        redirect: async ({ url, baseUrl }) => { return baseUrl },
        /* on session retrival */
        session: async ({ session, token }): Promise<ArahSmarthomeSession> => {
            let user = session.user as ArahSmarthomeUser
            let appId = ""

            if (token.sub) {
                const { uid, email, displayName } = await serverUtils.useSmarthome().storage.user.getByUid(token.sub);
                user = { id: uid, email, username: email?.split('@')[0], name: displayName }
                let key = `${uid}:app-permission:default`
                let maybeAppId = await serverUtils.useSmarthome().storage.userStorage.getItem<Record<string, string>>(key)
                appId = maybeAppId ? Object.keys(maybeAppId as object)[0] : appId
            }
            return Promise.resolve({ user, appId, expires: session.expires } as ArahSmarthomeSession)
        },
        /* on JWT token creation or mutation */
        jwt: async ({ token, user, session }) => {
            console.warn(['JWT', token.email]);
            token
            token.user = session
            return Promise.resolve(token)
        }
    },
    events: {
        async signIn(message) { /* on successful sign in */ },
        async signOut(message) { /* on signout */ },
        async session(message) { /* session is active */ },
    },
    pages: {
        signIn: '/signin',
        error: '/authentication/error',
    },
    jwt: {
        maxAge: 5 * 60
    },
    cookies: {
        // sessionToken: {
        //     name: `auth.session-token`,
        //     options: {
        //         httpOnly: true,
        //         sameSite: 'strict',
        //         path: '/',
        //         secure: false
        //     }
        // },
        // callbackUrl: {
        //     name: `auth.callback-url`,
        //     options: {
        //         httpOnly: true,
        //         sameSite: 'strict',
        //         path: '/',
        //         secure: false
        //     }
        // },
        // csrfToken: {
        //     name: `auth.csrf-token`,
        //     options: {
        //         httpOnly: true,
        //         sameSite: 'strict',
        //         path: '/',
        //         secure: false
        //     }
        // },
    }
})
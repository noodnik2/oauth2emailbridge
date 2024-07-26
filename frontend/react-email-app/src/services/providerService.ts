
export interface Provider {
    name: string;
    id: string;
}

const supportedProviders: Provider[] = [
    {
        name: 'Gmail SDK',
        id: 'google',
    },
    {
        name: 'Outlook SDK',
        id: 'msal',
    },
];

export const getProviders = (): Provider[] => {
    return supportedProviders;
}

export const getDefaultProvider = (): Provider => {
    return getProviders()[0];
}

export const getProvider = (id: string): Provider => {
    const provider = getProviders().find(p => p.id === id);
    if (!provider) {
        throw new Error(`provider(${id}) not found`);
    }
    return provider;
}


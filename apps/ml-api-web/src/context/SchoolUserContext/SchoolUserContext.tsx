import React, { useState, useEffect, useMemo } from 'react';

import { getRequest } from '../../utils/api';
import { GET_SCHOOL_USER_PROFILE } from '../../utils/endpoints';
import { GetUserProfileResponse } from '../../types/api-responses';
import { UserProfile } from '../../views/Dashboard/types';
import { pathOr, equals } from 'ramda';

export type AccountType = 'consumer' | 'school';
type SchoolUserContextType = {
    userProfile?: UserProfile;
    isAdmin: boolean;
    avatarUrl?: string;
};

const SchoolUserContext = React.createContext<SchoolUserContextType>({
    isAdmin: true,
    avatarUrl: '',
});

type SchoolUserProviderParams = {
    children: React.ReactNode
}

const SchoolUserProvider: React.FC<SchoolUserProviderParams> = (props: SchoolUserProviderParams) => {
    const [userProfile, setUserProfile] = useState<UserProfile>();
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>('');

    useEffect(() => {
        getRequest<{}, GetUserProfileResponse>(GET_SCHOOL_USER_PROFILE, {})
            .then(({ data }) => {
                setUserProfile(data);
                setAvatarUrl(data?.thumbnailPhotoUrl);
            })
            .catch(console.error);
    }, []);
    const isAdmin = useMemo(() => {
        return equals(pathOr(0, ['isAdmin'], userProfile), 1);
    }, [userProfile]);

    return (
        <SchoolUserContext.Provider
            value={{
                userProfile,
                isAdmin,
                avatarUrl,
            }}
            {...props}
        />
    );
};
const useSchoolUserContext = () => React.useContext(SchoolUserContext);

export { SchoolUserProvider, useSchoolUserContext };

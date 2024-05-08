import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { getRequest, postRequest } from '../../utils/api';
import { GET_USER_PROFILE, GET_USER_PLAN, GET_PLANS, UPDATE_USER_PLAN } from '../../utils/endpoints';
import { GetUserProfileResponse } from '../../types/api-responses';
import { UserProfile } from '../../views/Dashboard/types';
import { pathOr, equals, reduce, propEq, find } from 'ramda';
import { MixPanel } from '../../MixPanel';

export type PaymentPlan = 'free' | 'basic';
export type AccountType = 'consumer' | 'school';
type UserContextType = {
    userProfile?: UserProfile;
    updateUserProfile: (firstName: string, lastName: string, phone?: string, userAvatar?: string) => void;
    isAdmin: boolean;
    subscribedPlan: PaymentPlan;
    updateSubscribedPlan: (plan: PaymentPlan) => void;
    allowedFeatures: { [feature: string]: any };
    plan?: Plan;
    accountType: AccountType;
    avatarUrl?: string;
};
export type Feature = {
    id: string;
    name: string;
    value: any;
    interface: 'fe' | 'desktop';
};
export type Subscription = {
    id: string;
    status: string;
    currentPeriodEnd: number;
    currentPeriodStart: number;
    freeTrailEnd: number;
    current?: boolean;
    name?: string;
    scheduleStatus?: string;
    planName?: string;
    planID?: string;
};
export type Plan = {
    _id: string;
    name: string;
    active: boolean;
    features: Feature[];
    price: number;
    freeTrailUsed?: boolean;
    freeTrialPeriod?: number;
    subscriptions: Subscription[];
    subscription?: Subscription;
};

const UserContext = React.createContext<UserContextType>({
    updateUserProfile: () => {},
    isAdmin: true,
    subscribedPlan: 'basic',
    updateSubscribedPlan: () => {},
    allowedFeatures: {},
    accountType: 'consumer',
    avatarUrl: '',
});

const UserProvider: React.FC = (props) => {
    const [userProfile, setUserProfile] = useState<UserProfile>();
    const [subscribedPlan, setSubscribedPlan] = useState<PaymentPlan>('basic');
    const [accountType, setAccountType] = useState<AccountType>('consumer');
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>('');
    const [allowedFeatures, setAllowedFeatures] = useState({});
    const [plan, setPlan] = useState<Plan | undefined>(undefined);
    const getAllowedFeatures = useCallback(() => {
        getRequest<{}, Plan>(GET_USER_PLAN, {})
            .then(({ data }) => {
                let subscription;

                if (data.subscriptions) {
                    subscription = data.subscriptions.find((s) => {
                        const currentDateTime = Math.round(Date.now() / 1000);
                        if (s.planID?.toString() === data._id.toString() && s.currentPeriodStart <= currentDateTime && s.currentPeriodEnd >= currentDateTime) {
                            return true;
                        }
                        return false;
                    });
                    if (!subscription) {
                        subscription = find<Subscription>(propEq<any, any>('current', true), data.subscriptions || []);
                    }
                } else {
                    subscription = data.subscription;
                }

                setPlan({ ...data, subscription });
                const plan = (data.name.toLowerCase() || subscription?.planName?.toLowerCase()) as PaymentPlan;
                setSubscribedPlan(plan);
                const features = reduce(
                    (result, feature: Feature) => {
                        return {
                            ...result,
                            [feature.id]: feature.value,
                        };
                    },
                    {},
                    data.features,
                );

                setAllowedFeatures(features);
                // if (
                //   subscription?.current &&
                //   subscription.freeTrailEnd &&
                //   isBefore(subscription.freeTrailEnd * 1000, new Date()) &&
                //   subscription.status !== "active"
                // ) {
                //   history.push("/pay");
                // }
            })
            .catch((err) => {
                console.error(err);
                setSubscribedPlan('free');
                const status = pathOr<number>(0, ['response', 'status'], err);
                console.log('Status:', status);
                if (status === 400) {
                    getRequest<{}, any[]>(GET_PLANS, {})
                        .then(({ data }) => {
                            const { _id: planID = '' } = find<any>(propEq('name', 'Basic'), data);
                            postRequest<{ planID: string }, {}>(UPDATE_USER_PLAN, {
                                planID,
                            })
                                .then(() => {
                                    getAllowedFeatures();
                                })
                                .catch(() => {});
                        })
                        .catch(() => {});
                }
            });
    }, [setAllowedFeatures]);
    useEffect(
        function getUserProfile() {
            getRequest<{}, GetUserProfileResponse>(GET_USER_PROFILE, {})
                .then(({ data }) => {
                    setUserProfile(data);
                    setAccountType(data.accountType);
                    setAvatarUrl(data?.avatar);
                    MixPanel.identify(data.email);
                    MixPanel.people.set({ $email: data.email });
                    //setSubscribedPlan("free");
                })
                .catch(console.error);
            getAllowedFeatures();
        },
        [getAllowedFeatures],
    );
    const isAdmin = useMemo(() => {
        return equals(pathOr('R', ['role'], userProfile), 'A');
    }, [userProfile]);
    const updateUserProfile = useCallback(
        (firstName: string, lastName: string, phoneNumber?: string, loadedAvatar?: string) => {
            setUserProfile((userProfile: UserProfile | undefined) =>
                userProfile
                    ? {
                          ...userProfile,
                          firstName,
                          lastName,
                          avatar: loadedAvatar,
                          ...(phoneNumber ? { phoneNumber } : userProfile.phoneNumber ? { phoneNumber: '' } : {}),
                      }
                    : userProfile,
            );
            setAvatarUrl(loadedAvatar);
        },
        [setUserProfile],
    );
    const updateSubscribedPlan = useCallback(
        (plan: PaymentPlan) => {
            setSubscribedPlan(plan);
            getAllowedFeatures();
        },
        [setSubscribedPlan, getAllowedFeatures],
    );
    return (
        <UserContext.Provider
            value={{
                userProfile,
                updateUserProfile,
                isAdmin,
                subscribedPlan,
                updateSubscribedPlan,
                allowedFeatures,
                plan,
                accountType,
                avatarUrl,
            }}
            {...props}
        />
    );
};
const useUserContext = () => React.useContext(UserContext);

export { UserProvider, useUserContext };

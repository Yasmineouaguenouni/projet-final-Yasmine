import { useAuth0 } from "@auth0/auth0-react";
import { createContext, useEffect, useState } from "react";

const emptyUser = { name: "" };

export const CurrentUserContext = createContext({});

export const CurrentUserProvider = ({ children }) => {
    const { isLoading, error, isAuthenticated, getAccessTokenSilently, user } = useAuth0();
    const [currentUser, setCurrentUser] = useState(emptyUser);
    const [userExists, setUserExists] = useState(true);

    async function fetchUser() {
        if (!isAuthenticated) {
            setCurrentUser(emptyUser);
            return;
        }

        const accessToken = await getAccessTokenSilently();
        await fetch("/api/users/" + user.sub, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((res) => {
                setUserExists(res.ok);
                return res.json();
            })
            .then((json) => {
                setCurrentUser(json || emptyUser);
            });
    }

    useEffect(() => {
        if (isLoading) {
            setCurrentUser(emptyUser);
        } else if (error) {
            setCurrentUser(emptyUser);
        } else {
            fetchUser();
        }
    }, [user, isLoading, error, isAuthenticated]);

    return <CurrentUserContext.Provider value={{ currentUser, userExists, fetchUser }}>{children}</CurrentUserContext.Provider>;
};

export const CurrentUserConsumer = CurrentUserContext.Consumer;

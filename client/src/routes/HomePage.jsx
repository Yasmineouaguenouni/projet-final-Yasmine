import React, { useEffect, useState } from "react";

import Loading from "../components/Loading";
import PostFeed from "../components/PostFeed";
import { useAuth0 } from "@auth0/auth0-react";
import { styled } from "styled-components";

const HomePage = () => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [posts, setPosts] = useState(null);

    const fetchPosts = async () => {
        let accessToken;

        if (isAuthenticated) {
            accessToken = await getAccessTokenSilently();
        }

        try {
            const response = await fetch("/api/posts" + (accessToken ? "/not-mine" : ""), {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: "application/json",
                },
            });
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    if (!posts) {
        return <Loading />;
    }

    return (
        <Wrapper>
            <PostFeed posts={posts} />
        </Wrapper>
    );
};

const Wrapper = styled.main`
    width: calc(100% - 50px);
`;

export default HomePage;

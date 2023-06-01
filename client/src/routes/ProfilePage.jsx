import { useAuth0 } from "@auth0/auth0-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CurrentUserConsumer } from "../CurrentUser";
import Loading from "../components/Loading";
import PostFeed from "../components/PostFeed";

const ProfilePage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [posts, setPosts] = useState(null);

    async function reload() {
        setPosts(null);
        const accessToken = await getAccessTokenSilently();
        fetch("/api/posts/mine", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json",
            },
        })
            .then((res) => res.json())
            .then((json) => setPosts(json));
    }

    const fetchPost = useCallback(reload, [getAccessTokenSilently]);
    useEffect(() => {
        if (isAuthenticated) fetchPost();
        else navigate("/");
    }, [navigate, isAuthenticated, fetchPost]);

    return (
        <main>
            <CurrentUserConsumer>{(provider) => <h1>{provider.currentUser.name}'s Profile</h1>}</CurrentUserConsumer>

            <button onClick={() => navigate("/new")} className="button">
                Add new post
            </button>

            {posts ? <PostFeed posts={posts} reload={reload} /> : <Loading />}
        </main>
    );
};

export default ProfilePage;

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import Post from "../components/Post";
import { styled } from "styled-components";

const PostPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [comment, setComment] = useState("");
    const [data, setData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function fetchPost() {
        fetch("/api/posts/" + id, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        })
            .then((res) => {
                if (!res.ok) navigate("/");

                return res.json();
            })
            .then((json) => setData(json));
    }

    useEffect(() => {
        fetchPost();
    }, [navigate, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const accessToken = await getAccessTokenSilently();
            await fetch("/api/posts/" + id, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    comment,
                }),
            });
            setComment("");

            await fetchPost();
        } catch (error) {
            console.error("Error commenting:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!data) {
        return <Loading />;
    }

    return (
        <Wrapper>
            <div>
                <h1>{data.user.name}'s post</h1>

                <Post {...data.post} reload={() => navigate("/")} />
            </div>

            <div>
                <h2>Comments</h2>

                {isAuthenticated &&
                    (isSubmitting ? (
                        <Loading></Loading>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <textarea
                                id="comment"
                                name="comment"
                                rows="4"
                                cols="50"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            ></textarea>

                            <button className="button">Create comment</button>
                        </form>
                    ))}

                {data.post.comments.map((c) => (
                    <Comment key={c.userId + c.comment}>
                        <b>{c.user.name}</b>

                        {c.comment}
                    </Comment>
                ))}
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.main`
    display: flex;
    gap: 30px;
`;

const Comment = styled.div`
    display: flex;
    flex-direction: column;
`;

export default PostPage;

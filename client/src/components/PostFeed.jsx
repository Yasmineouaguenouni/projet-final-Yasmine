import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import Post from "./Post";

const PostFeed = ({ posts, reload }) => {
    const navigate = useNavigate();

    return (
        <Wrapper>
            {posts.map((post) => (
                <Hover onClick={() => navigate("/post/" + post._id)} key={post._id}>
                    <Post {...post} reload={reload} />
                </Hover>
            ))}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    align-items: center;
    justify-items: center;
    gap: 10px;
`;

const Hover = styled.div`
    border: 1px solid #ccc;
    cursor: pointer;
    padding: 10px;
`;

export default PostFeed;

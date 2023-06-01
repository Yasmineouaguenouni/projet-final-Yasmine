import { useAuth0 } from "@auth0/auth0-react";
import React, { useState } from "react";
import { FaHeart, FaTrash, FaPen, FaCheck } from "react-icons/fa";
import styled from "styled-components";

const Post = ({ title, src, description: des, _id, userId, lovers, reload }) => {
    const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
    const [loved, setLoved] = useState(lovers.includes(user?.sub));
    const [isAdmin] = useState(userId === user?.sub);
    const [editing, setEditing] = useState(false);
    const [description, setDescription] = useState(des);

    const handleLove = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const accessToken = await getAccessTokenSilently();
        await fetch("/api/posts/love/" + _id, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                loved: !loved,
            }),
        }).then((res) => {
            if (res.ok) setLoved(!loved);
        });
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!editing) {
            setEditing(true);
            return;
        }

        setEditing(false);
        const accessToken = await getAccessTokenSilently();
        await fetch("/api/posts/" + _id, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                description: description,
            }),
        });
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const accessToken = await getAccessTokenSilently();
        await fetch("/api/posts/" + _id, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        }).then((res) => {
            if (res.ok) reload();
        });
    };

    return (
        <Wrapper>
            <h3>{title}</h3>
            <Image src={src} alt="Clothing item" />
            <Description>
                {editing ? <input value={description} onChange={(e) => setDescription(e.target.value)} /> : description}

                {isAdmin && <Button onClick={handleEdit}>{editing ? <FaCheck color="000" /> : <FaPen color="000" />}</Button>}
            </Description>

            {isAuthenticated &&
                (isAdmin ? (
                    <Button onClick={handleDelete}>
                        <FaTrash color="f00" />
                    </Button>
                ) : (
                    <Button onClick={handleLove}>
                        <FaHeart color={loved ? "f00" : "000"} />
                    </Button>
                ))}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    max-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`;

const Image = styled.img`
    padding-inline: 75px;
    width: 80%;
    height: 400px;
    object-fit: cover;
`;

const Description = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
`;

const Button = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    width: 30px;
    cursor: pointer;
`;

export default Post;

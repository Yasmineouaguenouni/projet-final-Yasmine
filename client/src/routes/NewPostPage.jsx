import React, { useState } from "react";
import { uploadUrl } from "../cloudinary";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const NewPostPage = () => {
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    if (!isAuthenticated) {
        navigate("/");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Upload the image to Cloudinary
            const formData = new FormData();
            formData.append("file", image);
            formData.append("upload_preset", "dajavumarket");

            const response = await fetch(uploadUrl, {
                method: "POST",
                body: formData,
            });

            const jsonResponse = await response.json();
            const imageUrl = jsonResponse.secure_url;

            try {
                const accessToken = await getAccessTokenSilently();
                fetch("/api/posts", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        src: imageUrl,
                        description,
                        title,
                    }),
                })
                    .then((res) => {
                        return res.json();
                    })
                    .then((json) => {
                        navigate("/profile");
                    });
            } catch (error) {
                console.error("Error creating post:", error);
            }

            setImage(null);
            setDescription("");
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    return (
        <main>
            <h1>Create a New Post</h1>

            {isSubmitting ? (
                <Loading />
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" name="title" rows="4" cols="50" value={title} onChange={(e) => setTitle(e.target.value)} required></input>

                    <label htmlFor="image">Image:</label>
                    <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} required />

                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        rows="4"
                        cols="50"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                    <button type="submit">Submit</button>
                </form>
            )}
        </main>
    );
};

export default NewPostPage;

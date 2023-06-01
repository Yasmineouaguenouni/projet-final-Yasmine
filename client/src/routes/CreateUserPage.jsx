import { useAuth0 } from "@auth0/auth0-react";
import { useContext, useState } from "react";
import Loading from "../components/Loading";
import { CurrentUserContext } from "../CurrentUser";

const ProfilePage = () => {
    const { getAccessTokenSilently } = useAuth0();
    const { fetchUser } = useContext(CurrentUserContext);
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const accessToken = await getAccessTokenSilently();
            await fetch("/api/users/", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                }),
            });
            await fetchUser();
        } catch (error) {
            console.error("Error creating post:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main>
            <h1>Welcome to Deja Vu Market !</h1>

            {isSubmitting ? (
                <Loading />
            ) : (
                <form onSubmit={handleSubmit}>
                    <span>Please enter your name to sign up and continue with your account</span>

                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required></input>

                    <button type="submit" className="button">
                        Sign up
                    </button>
                </form>
            )}
        </main>
    );
};

export default ProfilePage;

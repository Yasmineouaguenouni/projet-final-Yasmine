import { useAuth0 } from "@auth0/auth0-react";
import { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { CurrentUserContext } from "./CurrentUser";
import Error from "./components/Error";
import Header from "./components/Header";
import Loading from "./components/Loading";
import CreateUserPage from "./routes/CreateUserPage";
import HomePage from "./routes/HomePage";
import NewPostPage from "./routes/NewPostPage";
import PostPage from "./routes/PostPage";
import ProfilePage from "./routes/ProfilePage";

const App = () => {
    const { userExists } = useContext(CurrentUserContext);
    const { isLoading, error } = useAuth0();

    if (isLoading) return <Loading />;
    if (error) return <Error />;

    return (
        <BrowserRouter>
            <Header />
            {userExists ? (
                <Routes>
                    <Route path="/" element={<HomePage />}></Route>
                    <Route path="/profile" element={<ProfilePage />}></Route>
                    <Route path="/post/:id" element={<PostPage />}></Route>
                    <Route path="/new" element={<NewPostPage />}></Route>
                </Routes>
            ) : (
                <CreateUserPage />
            )}
        </BrowserRouter>
    );
};

export default App;

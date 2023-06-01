import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../CurrentUser";
import { useContext } from "react";
import { styled } from "styled-components";

const Header = () => {
    const navigate = useNavigate();
    const { userExists, currentUser } = useContext(CurrentUserContext);
    const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

    return (
        <Wrapper>
            <Logo>Deja Vu Market</Logo>

            <Nav>
                {isAuthenticated && userExists && <Username>Hi, {currentUser.name}!</Username>}

                {userExists && (
                    <button onClick={() => navigate("/")} className="button">
                        Home
                    </button>
                )}

                {isAuthenticated ? (
                    <>
                        {userExists && (
                            <button onClick={() => navigate("/profile")} className="button">
                                Profile
                            </button>
                        )}
                        <button onClick={() => logout()} className="button">
                            Log Out
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={loginWithRedirect} className="button">
                            Log In
                        </button>
                    </>
                )}
            </Nav>
        </Wrapper>
    );
};

const Wrapper = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #2d2d2d;
    padding: 1rem;
    color: #ffffff;
`;

const Logo = styled.span`
    font-size: 1.5rem;
    font-weight: bold;
`;

const Nav = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const Username = styled.span`
    margin-right: 1rem;
`;

export default Header;

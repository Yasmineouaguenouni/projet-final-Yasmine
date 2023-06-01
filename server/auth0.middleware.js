import { auth } from "express-oauth2-jwt-bearer";

export default auth({
    audience: "http://localhost:3003",
    issuerBaseURL: "https://dev-t8v4fael2ayazpv0.us.auth0.com/",
    tokenSigningAlg: "RS256",
});

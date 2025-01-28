import {auth} from "express-oauth2-jwt-bearer";

const jwtCheck = auth({
  audience: "https://dev-ee4hguujf503yj1e.us.auth0.com/api/v2/",
  issuerBaseURL: "https://dev-ee4hguujf503yj1e.us.auth0.com",
  tokenSigningAlg: "RS256",
});

export default jwtCheck;

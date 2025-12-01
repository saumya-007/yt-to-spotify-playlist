const { responseSuccess, responseError } = require("../utils/constants");

const { getTokenDetailsByUserId } = require("../db/queries");

module.exports.getUserTokenStatus = async function (req, res) {
  try {
    const userId = req.query.userId;
    const tokenDetails = await getTokenDetailsByUserId({ userId });
    res.status(200).send({ ...responseSuccess, data: {
        googleAuthenticated: !!tokenDetails?.access_token_google && !!tokenDetails?.refresh_token_google,
        spotifyAuthenticated: !!tokenDetails?.access_token_spotify && !!tokenDetails?.refresh_token_spotify,
    } });
  } catch (err) {
    res
      .status(400)
      .send({ ...responseError, message: "Error while getting token details" });
  }
};

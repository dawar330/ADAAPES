const cardanoUrl = "https://cardano-mainnet.blockfrost.io/api/v0/";
const apiKey = "mainnetY83qEPLIPDAweUxoUx4cBN0ZFEq04d7E";
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const request = async (base, endpoint, headers, body) => {
  return await fetch(base + endpoint, {
    headers: {
      project_id: apiKey,
      ...headers,
    },
    method: body ? "POST" : "GET",
    body,
  }).then(async (response) => {
    if (!response.ok) {
      console.log("responsda", response);
      return response.status;
    }
    return response.json();
  });
};
const cardano = async (endpoint, headers, body) => {
  return await request(cardanoUrl, endpoint, headers, body);
};

export default cardano;

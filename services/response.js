async function sendResponse({ status, statusCode, message, payload, res }) {
  const isSuccess = status === "success";
  res.status(statusCode).json({ error: true, message });
}

module.exports = sendResponse;

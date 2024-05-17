async function sendResponse({ status, statusCode, message, payload, res }) {
  const isSuccess = status === 'success';
  res.status(statusCode).json({ status, isSuccess, message, data: payload });
}

module.exports = sendResponse;

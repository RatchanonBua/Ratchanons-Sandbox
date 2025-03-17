const crypto = require('crypto');

// LINE
const verifyLineSignature = (req, res, next) => {
  const channelSecret = process.env.LINE_CHANNEL_SECRET;
  const signature = req.headers['x-line-signature'];
  const body = JSON.stringify(req.body);
  const hash = crypto.createHmac('SHA256', channelSecret).update(body).digest('base64');
  if (hash !== signature) { return res.status(401).send('Invalid Signature'); }
  console.log('Verify Signature Success!');
  next();
}

module.exports = { verifyLineSignature };
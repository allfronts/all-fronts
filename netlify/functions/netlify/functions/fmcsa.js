const https = require('https');

exports.handler = async function(event) {
  const dot = event.queryStringParameters && event.queryStringParameters.dot;

  if (!dot || isNaN(dot)) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Invalid DOT number' })
    };
  }

  const url = `https://mobile.fmcsa.dot.gov/qc/services/carriers/${dot}?webKey=ee14415650ad4ebab6bc0b76b3bc2dd3`;

  try {
    const data = await new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try { resolve(JSON.parse(body)); }
          catch(e) { reject(new Error('Invalid JSON')); }
        });
      }).on('error', reject);
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch(err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};

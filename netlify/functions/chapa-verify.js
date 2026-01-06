exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { tx_ref } = JSON.parse(event.body);

    if (!tx_ref) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing transaction reference' })
      };
    }

    console.log('Verifying transaction:', tx_ref);

    const response = await fetch(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`
        }
      }
    );

    const data = await response.json();
    
    console.log('Chapa verification response:', JSON.stringify(data, null, 2));

    const verified = data.status === 'success' && data.data?.status === 'success';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: data.status,
        verified,
        data: data.data || null,
        message: verified ? 'Payment verified successfully' : 'Payment not verified'
      })
    };
  } catch (error) {
    console.error('Chapa verification error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};

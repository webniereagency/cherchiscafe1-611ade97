exports.handler = async (event) => {
  // CORS headers for frontend
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
    const { 
      amount, 
      email, 
      first_name, 
      last_name, 
      phone,
      tx_ref,
      order_items 
    } = JSON.parse(event.body);

    // Validate required fields
    if (!amount || !email || !first_name || !tx_ref) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: amount, email, first_name, tx_ref' })
      };
    }

    // Get the site URL from environment or use the request origin
    const siteUrl = process.env.URL || 'https://cherishaddis.netlify.app';

    const response = await fetch('https://api.chapa.co/v1/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: String(amount),
        currency: 'ETB',
        email,
        first_name,
        last_name: last_name || first_name,
        phone_number: phone || '',
        tx_ref,
        callback_url: `${siteUrl}/payment-success`,
        return_url: `${siteUrl}/payment-success?tx_ref=${tx_ref}`,
        customization: {
          title: 'Cherish Addis Coffee & Books',
          description: order_items || 'Café Order'
        }
      })
    });

    const data = await response.json();
    
    console.log('Chapa initiate response:', JSON.stringify(data, null, 2));

    if (data.status === 'success') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'success',
          checkout_url: data.data.checkout_url,
          tx_ref
        })
      };
    } else {
      console.error('Chapa error:', data);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          status: 'failed',
          error: data.message || 'Payment initialization failed' 
        })
      };
    }
  } catch (error) {
    console.error('Chapa initiation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};

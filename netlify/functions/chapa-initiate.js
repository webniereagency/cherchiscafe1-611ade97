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
      body: JSON.stringify({ status: 'failed', error: 'Method not allowed' })
    };
  }

  // Validate CHAPA_SECRET_KEY exists
  const chapaSecretKey = process.env.CHAPA_SECRET_KEY;
  if (!chapaSecretKey) {
    console.error('CHAPA_SECRET_KEY is not configured');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ status: 'failed', error: 'Payment service not configured. Please contact support.' })
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

    console.log('Payment request received:', { amount, email, first_name, tx_ref });

    // Validate required fields
    if (!amount || !email || !first_name || !tx_ref) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ status: 'failed', error: 'Missing required fields: amount, email, first_name, tx_ref' })
      };
    }

    // Get the site URL - prioritize deploy preview URL for correct redirects
    const siteUrl = process.env.DEPLOY_PRIME_URL || process.env.URL || event.headers.origin || 'https://cherishaddis.netlify.app';
    console.log('Using site URL:', siteUrl);

    console.log('Calling Chapa API...');
    const response = await fetch('https://api.chapa.co/v1/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${chapaSecretKey}`,
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

    console.log('Chapa API response status:', response.status);
    
    // Parse response as text first to handle non-JSON errors
    const responseText = await response.text();
    console.log('Chapa API response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error('Non-JSON response from Chapa:', responseText);
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ status: 'failed', error: 'Invalid response from payment service' })
      };
    }

    if (data.status === 'success' && data.data?.checkout_url) {
      console.log('Payment initialized successfully, checkout URL:', data.data.checkout_url);
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
    console.error('Chapa initiation error:', error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ status: 'failed', error: 'Payment service unavailable. Please try again.' })
    };
  }
};

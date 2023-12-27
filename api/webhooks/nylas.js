import axios from 'axios';

// example callback_url: https://node-webhooks-challenge-serverless-function.vercel.app/api/webhooks/nylas
export default  async function handler(request, response) {
  
  // /api/webhooks/nylas?challenge={{CHALLENGE_STRING}}
  if (request.method === "GET" && request.query.challenge) {
    console.log(`Received challenge code! - ${request.query.challenge}`);
    console.log(`Now returning challenge code! - ${request.query.challenge}`);
    // we need to enable the webhook by responding with the challenge parameter
    // CHALLENGE_STRING
    return response.send(request.query.challenge);
  }

 if (request.method === "POST") {
  console.log('==========Message updated start==========');
  request.body.deltas.map(deltas => console.log(JSON.stringify(deltas)));
  console.log('==========Message updated end==========\n');

  // Send the data to Customer.io webhook endpoint
  const customerIoWebhookUrl = 'https://api.customer.io/v1/webhook/f13fe1e2c48f1fd9';
  
  try {
    // Assuming request.body contains the data you want to send to Customer.io
    const eventData = request.body;

    // Make an HTTP POST request to Customer.io webhook endpoint
    await axios.post(customerIoWebhookUrl, eventData);

    // Responding to Nylas is important to prevent the webhook from retrying
    return response.status(200).end();
  } catch (error) {
    console.error('Error sending data to Customer.io:', error);

    // Respond with an error status if the request to Customer.io fails
    return response.status(500).end();
  }
}
}

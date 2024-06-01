async function receive(url, auth) {
  const batch = 5;
  const data = {
    count: batch,
    ackmode: "ack_requeue_true",
    encoding: 'auto'
  };

  let msgs = [];
  do {
    const request = Functions.makeHttpRequest({
      url: url,
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      data: data,
      timeout: 10_000,
      responseType: 'json'
    });

    const response = await request;
    if (response.error) {
      console.error(`receive msg error: ${response.code} ${response.message}`);
      throw Error("Request failed");
    }

    msgs = response.data;
    for (let i in msgs) {
      const msg = JSON.parse(msgs[i].payload);
      const url = msg.url;
      const apiKey = msg.apiKey;
      const from = msg.from;
      const to = msg.to;
      const username = msg.username;
      console.log(`url ${url} apiKey ${apiKey}`);
      await notify(url, apiKey, from, to, username);
    }
  } while (msgs.lengh < batch);
}

async function notify(url, apiKey, from, to, username) {
  const content = `
    Hi, ${username}:
  
    Welcome to join the Ceptor Club,
  
    We are a worldwide party of role-players who came together to make an app that would make the process of playing a fantasy RPG together easier and more visually engaging.
    Learn more: https://ceptor.club/.
  
    Please join our discord https://discord.gg/EYZwc7De.
    `.trim();
  const msg = {
    personalizations: [
      {
        to: [{ email: to }]
      }
    ],
    from: { email: from },
    subject: 'Ceptor Club onboarding',
    content: [
      {
        type: 'text/plain',
        value: content
      }
    ]
  };

  const request = Functions.makeHttpRequest({
    url: url,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    data: msg,
    timeout: 20_000,
    responseType: 'json'
  });

  const response = await request;
  if (response.error && response.message !== 'SyntaxError: Unexpected end of JSON input') {
    console.error(`notify error: ${response.message}`);
    throw Error("Request failed");
  } else {
    console.log(`notify: ${response.statusText} ${response.data}`);
  }
}

const url = args[0];
if (url) {
  throw Error("url is missing.");
}

const auth = secrets.auth;
if (!auth) {
  throw Error("auth is missing.");
}

await receive(url, auth);

return Functions.encodeString('Succeed');
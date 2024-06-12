import Mailjet from "node-mailjet";

const client = Mailjet.Client.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, name, message } = req.body;
 
  if (!email || !name || !message) {
  return res.status(400).json({ message: 'Bad Request: Missing required fields' });
}

  try {
    const response = await client.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: "philippe@243technologies.com",
            Name: "RDC Etudes Website",
          },
          To: [
            {
              Email: "salut@rdcetudes.com",
              Name: "RDC Etudes",
            },
          ],
          Subject: `Feedback de ${email}` ,
          TextPart: message,
        },
      ],
    });

    res.status(200).json({ status: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

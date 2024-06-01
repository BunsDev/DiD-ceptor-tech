if (!process.env.RABBITMQ_AUTH) {
    throw new Error("rabbitmq auth not provided - check your environment variable RABBITMQ_AUTH");
}

const secrets = { auth: process.env.RABBITMQ_AUTH };
const slotId = 1;

export { slotId, secrets };
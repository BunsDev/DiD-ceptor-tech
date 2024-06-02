# How to call the restful API

> NOTE: The API was moved as server action to the nextjs server.
## Registered users API

Below is an example of how to call this API

```
GET http://localhost:3000/api/user
 
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
[
    {
        "id": "did:ethr:0xaa36a7:0xAD849E351533Db54D0BD22De977a653edfd9EEb8",
        "name": "user",
        "email": "user@gmail.com",
        "role": "other",
        "projects": [
            "tech",
            "game"
        ],
        "initiative": 8,
        "contactMethod": "email",
        "indiscord": false,
        "address": "0xaa36a7:0xAD849E351533Db54D0BD22De977a653edfd9EEb8"
    }
]
```

## Register user API

Below is an example of how to call user API

```
POST http://localhost:3000/api/user
Content-Type: application/json
 
{
"id": "did:ethr:0xaa36a7:0xAD849E351533Db54D0BD22De977a653edfd9EEb8",
"name": "user",
"email": "user@gmail.com",
"role": "other",
"projects": ["tech", "game" ],
"initiative": 8,
"contactMethod": "email",
"indiscord": false
}
 
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
 
{"message":"user 0xaa36a7:0xAD849E351533Db54D0BD22De977a653edfd9EEb8 user joined."}
```

### how to specify the user id

the id is the did format, for ethrethereum address, its format is: did:ethr:<chainid>:<ethr address>
the chainid should be hex format, you can find the chainid for each network in the following link, you can omit the chainid for mainnet.
https://github.com/uport-project/ethr-did-registry?tab=readme-ov-file#contract-deployments

the ethr address should be hex format.

## Notification API

Below is an example of how to call this API

```
POST http://localhost:3000/api/notification
[
    {
        "email": "mayanlong01@163.com",
        "username": "xxxxx"
    }
]
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
 
notification sent.
```

# How to call the chainlink functions

+ add a js/ts file in the /packages/hardhat/function folder, the file name should look like 00_backstory_gpt.ts.

+ if you need secret in your js file, add a js/ts secret file in the /packages/hardhat/secrets folder, it must use the exact same name. This file must `export { ttl, secrets };` a `DONSecret` interface was created to help this.

+ to update the secrets reference: run `yarn hardhat:link:gw:update-secrets`.
  - It requires one of these 2 arguments: `--secret 03_example_name.ts` or `--slot 03` notice `03` is the prefix of the filename, please replace `03_example_name.ts` with your js/ts secret file name.
  - If you want to update the reference on the client contract use `--client` flag.
  - By default the `--client` flag will update the `CCExampleClient` contract, use `--contract` param to specify the contract name.
  - The `--client` flag is `false` by default. Which means it will update the `CCGateway` contract secret reference.

+ to update subscription: run `yarn hardhat:link:gw:update-subscription --file 01_onboarding_notification.js`, please replace `01_onboarding_notification.js` with your js/ts secret file name

+ call the chainlink functions, import `/packages/nextjs/services/eth/request.ts`, call `makeRequest(network: string, args: any[])`, you need pass the network and args for chainlink functions
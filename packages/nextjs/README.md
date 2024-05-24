# How to call the restful API

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
ETag: "k5xu2dpe1l2b"
Content-Length: 83
Vary: Accept-Encoding
Date: Wed, 22 May 2024 12:10:24 GMT
Connection: keep-alive
Keep-Alive: timeout=5
 
{"message":"user 0xaa36a7:0xAD849E351533Db54D0BD22De977a653edfd9EEb8 user joined."}
```

### how to specify the user id

the id is the did format, for ethrethereum address, its format is: did:ethr:<chainid>:<ethr address>
the chainid should be hex format, you can find the chainid for each network in the following link, you can omit the chainid for mainnet.
https://github.com/uport-project/ethr-did-registry?tab=readme-ov-file#contract-deployments

the ethr address should be hex format.
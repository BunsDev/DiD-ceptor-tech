import { task } from "hardhat/config";
import { decodeResult, ReturnType, simulateScript } from "@chainlink/functions-toolkit";
import { ethers } from "ethers@v5";
import { loadScript } from "@/functions";
import { getSecretByName } from "@/secrets";

task("simulate", "Simulate an oracle function call")
  .addParam("name", "The function to call")
  .addOptionalVariadicPositionalParam("args", "The arguments to pass to the function")
  .setAction(async params => {
    const { name, args } = params;
    console.log("Simulating %s with args %s", name, args);

    const { source } = await loadScript(name);
    const { secrets } = await getSecretByName(name);

    const response = await simulateScript({
      source,
      args,
      bytesArgs: [], // bytesArgs - arguments can be encoded off-chain to bytes.
      secrets,
    });

    console.log("Simulation result", response);
    const errorString = response.errorString;
    if (errorString) {
      console.log(`❌ Error during simulation: `, errorString);
    } else {
      const returnType = ReturnType.string;
      const responseBytesHexstring = response.responseBytesHexstring;
      if (responseBytesHexstring && ethers.utils.arrayify(responseBytesHexstring).length > 0) {
        const decodedResponse = decodeResult(responseBytesHexstring, returnType);
        console.log(`✅ Decoded response to ${returnType}: `, decodedResponse);
      }
    }
  });

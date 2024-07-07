import app from "./api/index.js";
import path from "path";
import { readFromDatabase, updateDatabase } from "./utils/functions.js";
import { v4 as uuidv4 } from "uuid";

export const testCaseApis = async () => {
  //   app.get("/:address/nft/:nftId", (req, res) => {
  //     const { address, nftId } = req.params;
  //   });

  app.route("/mock/uploadJsonToIpfs").post(async function (req, res) {
    console.log("/mock/uploadJsonToIpfs");
    console.log(req.body);
    const randomHash = uuidv4();
    console.log(req.body);
    const data = { [randomHash]: req.body };
    const updatedData = updateDatabase(data);
    res.send(randomHash);
  });

  app.route("/data/:hash").get(async function (req, res) {
    const { hash } = req.params;
    res.send(readFromDatabase(hash));
  });
};

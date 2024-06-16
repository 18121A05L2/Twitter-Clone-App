import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import pinataSDK from "@pinata/sdk";
import { twitterbackend } from "../utils.js";
import { Readable } from "stream";
import "dotenv/config";
import { ethers } from "ethers";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const pinataJWTKey = process.env.PINATA_JWT_SECRET;
const mongooseConnectionUrl = process.env.MONGOOSE_CONNTECTION_URL;
const pinata = new pinataSDK({
  pinataJWTKey,
});
pinata
  .testAuthentication()
  .then((pinataAuthTest) => {
    console.log({ pinataAuthTest });
  })
  .catch((err) => {
    console.log(err);
  });

const PORT = process.env.PORT || 8001;

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_URL);
const privateKey = process.env.ACCOUNT2_PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

async function main() {
  // -----------------------------------   Mongo DB ---------------------------------------

  await mongoose
    .connect(mongooseConnectionUrl)
    .then((value) => {
      // console.log(value);
      console.log("successfully connected with mongoose");
    })
    .catch((err) => {
      console.log("There is an error connecting to mongoose");
      console.log(err);
    });

  twitterbackend();

  app.get("/", (req, res) => res.send("Express on Vercel"));

  // ------------------ PINATA SDK -------------------------

  app.route("/uploadJsonToIpfs").post(async function (req, res) {
    res.send(await pinata.pinJSONToIPFS(req.body));
  });

  app
    .route("/uploadImageToIpfs")
    .post(upload.single("image"), async function (req, res) {
      const options = {
        pinataMetadata: {
          name: req.file.fieldname,
        },
      };
      const fileBuffer = req.file.buffer;
      const readableStream = Readable.from(fileBuffer);
      res.send(await pinata.pinFileToIPFS(readableStream, options));
    });

  app.route("/sendEth").post(async function (req, res) {
    // console.log(req.body)
    const { address } = req.body;
    const amount = 0.01;

    try {
      const tx = {
        to: address,
        value: ethers.parseEther(amount.toString()),
      };

      const transaction = await wallet.sendTransaction(tx);
      await transaction.wait();

      res.status(200).send({ txHash: transaction.hash });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Transaction failed" });
    }
  });
}
main().catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log("listening on port 8001 ");
});

export default app;

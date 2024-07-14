import mongoose from "mongoose";
import { app } from "../api/index.js";
export const twitterbackend = async () => {
  // -------------------------------------   Tweets ----------------------------------
  const commentSchema = mongoose.Schema(
    {
      postId: String,
      replyData: String,
      avatar: String,
      userId: String,
      tweetUserId: String,
      userName: String,
    },
    { timestamps: true }
  );
  const tweetSchema = mongoose.Schema(
    {
      userEmail: String,
      userId: String,
      avatar: String,
      userName: String,
      userInput: String,
      postimage: String,
      comments: [commentSchema],
      likes: Array,
      retweets: Array,
    },
    { timestamps: true }
  );
  const Tweet = mongoose.model("Tweet", tweetSchema);
  // Tweet is the mongoose collection
  app
    .route("/tweets")
    .get(async (req, res) => {
      res.send(await Tweet.find({}).sort({ createdAt: -1 }));
    })
    .post((req, res) => {
      const tweet = new Tweet({
        userEmail: req.body.userEmail,
        userId: req.body.userId,
        avatar: req.body.avatar,
        userName: req.body.userName,
        userInput: req.body.userInput,
        comments: [],
        likes: [],
        retweets: [],
      });
      tweet.save();
      res.send("successful");
    });

  // ------------------------------------------- specific tweet --------------------------------
  app.route("/tweet").post(async (req, res) => {
    res.send(await Tweet.findOne({ _id: req.body._id }));
    // console.log("tweet id "+req.body._id)
  });

  // ---------------------------------------  Comments ---------------------------------
  app
    .route("/comments")
    .get(async (req, res) => {
      res.send(
        await Tweet.findOne({ _id: req.body._id }).sort({ createdAt: -1 })
      );
    })
    .post(async ({ body }, res) => {
      let postComments;
      let newComment = body;

      await Tweet.findOne({ _id: body.postId }).then((value) => {
        console.log("value in comment : " + value);
        postComments = value.comments;
        postComments.push(newComment);
      });
      await Tweet.updateOne(
        { _id: body.postId },
        { $set: { comments: postComments } }
      );
      res.send("successful");
    });

  // --------------------------------  Likes -------------------------------

  app.route("/likes").post(async (req, res) => {
    userId = req.body.userId;
    postId = req.body.postId;
    let allLikes = [];

    await Tweet.findOne({ _id: postId }).then((value) => {
      allLikes = value.likes;
      console.log("value : " + value);
    });
    let index;
    const userLiked = allLikes.filter((item, i) => {
      index = i;
      return item.userId === userId;
    });
    console.log("index : " + index);

    if (userLiked.length) {
      allLikes.splice(index, 1);
      await Tweet.updateOne({ _id: postId }, { $set: { likes: allLikes } });
      console.log(allLikes);
      res.send("unliked");
      console.log("unliked");
    } else {
      allLikes.push({ userId: userId });
      await Tweet.updateOne({ _id: postId }, { $set: { likes: allLikes } });

      res.send("liked");
      console.log("liked");
    }
  });

  // ------------------------------------- profile posts -------------------------
  app.route("/profileposts").post(async function (req, res) {
    console.log(req.body.userId);
    res.send(
      await Tweet.find({ userId: req.body.userId }).sort({ createdAt: -1 })
    );
    console.log(" fetched profile data");
  });

  //-------------------------------- profile creation ----------------------

  const profileSchema = mongoose.Schema(
    {
      backgroundImage: String,
      userId: String,
      avatar: String,
      name: String,
      bio: String,
      location: String,
      website: String,
      birthDate: Date,
    },
    { timestamps: true }
  );
  const Profile = mongoose.model("Profile", profileSchema);
  app
    .route("/profile")
    .post(async function (req, res) {
      const isUserExists = await Profile.findOne({ userId: req.body.userId });
      console.log("all profiles code" + isUserExists);
      if (!isUserExists && req.body.userId !== "@undefined") {
        const profile = new Profile({
          backgroundImage: "",
          userId: req.body.userId,
          avatar: req.body.avatar,
          name: req.body.name,
          bio: "",
          location: "",
          website: "",
          birthDate: new Date(),
        });
        profile.save();
        console.log("created profile");
        res.send("created profile");
      } else {
        console.log("profile already exists");
        res.send("profile already exists");
      }
    })
    .get(async function (req, res) {
      res.send(await Profile.find({}));
    })
    .put(async function ({ body }, res) {
      console.log(" put is triggered " + body.userID);
      await Profile.replaceOne(
        { userId: body.userId },
        {
          userId: body.newUserId,
          backgroundImage: body.backgroundImage,
          avatar: body.avatar,
          name: body.name,
          bio: body.bio,
          location: body.location,
          website: body.website,
          birthDate: new Date(),
        },
        { overwrite: true }
      );
      console.log("data updated successfully");
      res.send("data added successfully");
    });

  // ------------------------------------- profile Data --------------------
  app.route("/profiledata").post(async function (req, res) {
    let data = await Profile.findOne({ userId: req.body.userId });
    console.log("profile data" + data);
    res.send(data);
  });

  // ---------------------------------------------- chat or conversation -----------------------------
  const messageSchema = mongoose.Schema(
    {
      senderAddress: String,
      receiverAddress: String,
      msg: String,
    },
    { timestamps: true }
  );

  const conversationSchema = mongoose.Schema(
    {
      conversationId: String,
      messages: [messageSchema],
    },
    { timestamps: true }
  );

  const Conversation = mongoose.model("Conversation", conversationSchema);

  app.route("/conversation/creation").post(async ({ body }, res) => {
    const isConversationExits = await Conversation.findOne({
      conversationId: body.conversationId,
    });
    console.log(isConversationExits);

    if (!isConversationExits) {
      const conversation = new Conversation({
        conversationId: body.conversationId,
        messages: [],
      });
      await conversation.save();
    }

    console.log("conversation : " + body.conversationId);
    res.send("successfully");
  });

  app.route("/conversation").post(async (req, res) => {
    let allMessages = [];
    await Conversation.findOne({
      conversationId: req.body.conversationId,
    }).then((value) => {
      allMessages = value?.messages;
      console.log(
        "all messages with conversation id : " + req.body.conversationId
      );
      console.log();
    });
    res.send(allMessages);
  });

  // ---------------------------------------- Messages ------------------------
  app.route("/message").post(async ({ body }, res) => {
    let allMessages = [];
    let newMsg = {
      receiverAddress: body.receiverAddress,
      senderAddress: body.senderAddress,
      msg: body.msg,
    };
    await Conversation.findOne({
      conversationId: body.conversationId,
    })
      .select("messages")
      .then((value) => {
        // console.log(" value  : "+value)
        allMessages = value.messages;
        allMessages?.push(newMsg);
      });

    await Conversation.updateOne(
      { conversationId: body.conversationId },
      { $set: { messages: allMessages } }
    );

    // console.log(" Messages Array : " + allMessages);
    res.send(allMessages);
  });
};

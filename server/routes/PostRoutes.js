const router = require("express").Router();
const validateFirebaseToken = require('../utils/validate.js');
const admin = require('firebase-admin');

router.post("/create", validateFirebaseToken, async (req, res) => {
  const { title, content, author, timestamp, images, comments } = req.body
  const db = admin.firestore();

  db.collection("posts").add({
    title: title,
    content: content,
    author: author,
    timestamp: timestamp,
    images: images,
    comments: comments
    })
    .then((docRef) => {
        res.status(200).json({ message: "Saved", id: docRef.id });
    })
    .catch((error) => {
      console.error("Firestore Error:", error);
        res.status(400).json({ code: error.code, error: error.message });
    });

});

router.post("/get", validateFirebaseToken, async (req, res) => {
  const db = admin.firestore();

  db.collection("posts")
  .get()
  .then((querySnapshot) => {
    // Map through querySnapshot to construct the data array
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Include the document ID
      ...doc.data(), // Include the document data
    }));

    // Send the data array in the response
    res.status(200).json(data);
  })
  .catch((error) => {
    // Handle and return the error
    res.status(400).json({ code: error.code, error: error.message });
  });

});

router.post("/getOne", validateFirebaseToken, async (req, res) => {
  const { postId } = req.body
  const db = admin.firestore();

  db.collection("posts").doc(postId)
  .get()
  .then((doc) => {
    if (doc.exists) {
      res.status(200).json(doc.data());
    } else {
      res.status(404).json({ message: "Not found" });
    }
  })
  .catch((error) => {
    res.status(400).json({ code: error.code, error: error.message });
  });

});

router.post("/update", validateFirebaseToken, async (req, res) => {
  const { postId, title, content, images, timestamp } = req.body
  const db = admin.firestore();

  db.collection("posts").doc(postId).update({
    title: title,
    content: content,
    images: images,
    timestamp: timestamp
  });

});

router.post("/delete", validateFirebaseToken, async (req, res) => {
    const { postId } = req.body
    const db = admin.firestore();
    
    db.collection("posts").doc(postId).delete()
    .then(() => {
        res.status(200).json({ message: "Deleted" });
    })
    .catch((error) => {
        console.error("Firestore Error:", error);
        res.status(400).json({ code: error.code, error: error.message });
    });
    
});

router.post("/comment/add", validateFirebaseToken, async (req, res) => {
  const { postId, user, timestamp, comment } = req.body
  const db = admin.firestore();

  db.collection("posts").doc(postId).update({
    comments: admin.firestore.FieldValue.arrayUnion({
      user: user,
      timestamp: timestamp,
      comment: comment
    })
  })
  .then(() => {
      res.status(200).json({ message: "Saved" });
  })
  .catch((error) => {
    console.error("Firestore Error:", error);
      res.status(400).json({ code: error.code, error: error.message });
  });

});

router.post("/comment/delete", validateFirebaseToken, async (req, res) => {
    const { postId, commentId } = req.body
    const db = admin.firestore();
    
    db.collection("posts").doc(postId).update({
        comments: admin.firestore.FieldValue.arrayRemove(commentId)
    })
    .then(() => {
        res.status(200).json({ message: "Deleted" });
    })
    .catch((error) => {
        console.error("Firestore Error:", error);
        res.status(400).json({ code: error.code, error: error.message });
    });
    
});

exports.router = router;
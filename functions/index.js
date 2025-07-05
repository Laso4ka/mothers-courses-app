const functions = require("firebase-functions");
const cors = require("cors")({origin: true});
const admin = require("firebase-admin");
const crypto = require("crypto");
const {defineString} = require("firebase-functions/params");

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

const LIQPAY_PUBLIC_KEY = defineString("LIQPAY_PUBLIC_KEY");
const LIQPAY_PRIVATE_KEY = defineString("LIQPAY_PRIVATE_KEY");
const APP_BASE_URL = defineString("APP_BASE_URL", {
  description: "Base URL of the Angular application (e.g., http://localhost:4200 or https://your-domain.com)",
  default: "http://localhost:4200",
});

exports.createLiqpayData = functions
    .https.onRequest(async (req, res) => {
      cors(req, res, async () => {
        if (req.method !== "POST") {
          return res.status(405).send({error: "Method Not Allowed"});
        }

        const clientCourseData = req.body.course;

        if (!clientCourseData || !clientCourseData.id) {
          return res.status(400).send({error: "Missing course ID"});
        }

        let coursePrice;
        let courseTitle;

        try {
          const courseDoc = await db.collection("courses")
              .doc(clientCourseData.id).get();
          if (!courseDoc.exists) {
            return res.status(404).send({error: "Course not found"});
          }
          const courseDataFromDB = courseDoc.data();
          coursePrice = courseDataFromDB.price;
          courseTitle = courseDataFromDB.title;

          if (typeof coursePrice !== "number" || coursePrice <= 0) {
            console.error("Invalid price for course:",
                clientCourseData.id, coursePrice);
            return res.status(500)
                .send({error: "Invalid course price configured."});
          }
        } catch (error) {
          console.error("Error fetching course data from Firestore:", error);
          return res.status(500)
              .send({error: "Could not retrieve course details"});
        }

        const orderId = `course_${clientCourseData.id}_${Date.now()}`;
        const SERVER_CALLBACK_URL = "https://us-central1-mothers-courses-app-firebase.cloudfunctions.net/liqpayCallbackHandler";
        const resultUrlWithParams = `${APP_BASE_URL.value()}/payment-result?liqpay_order_id=${encodeURIComponent(orderId)}`;

        const payload = {
          version: "3",
          public_key: LIQPAY_PUBLIC_KEY.value(),
          action: "pay",
          amount: coursePrice.toFixed(2), // Ціна з Firestore
          currency: "UAH",
          description: `Оплата курсу: ${courseTitle}`, // Назва з Firestore
          order_id: orderId,
          result_url: resultUrlWithParams,
          server_url: SERVER_CALLBACK_URL, // URL для серверного callback
          language: "uk", // Можна додати мову
        };

        const data = Buffer.from(JSON.stringify(payload)).toString("base64");
        const signature = crypto
            .createHash("sha1")
            .update(LIQPAY_PRIVATE_KEY.value() + data + LIQPAY_PRIVATE_KEY.value())
            .digest("base64");

        return res.status(200).json({data, signature, generated_order_id: orderId});
      });
    });


exports.liqpayCallbackHandler = functions
    .https.onRequest(async (req, res) => {
      if (req.method !== "POST") {
        console.log("LiqPay Callback: Method Not Allowed -", req.method);
        return res.status(405).send("Method Not Allowed");
      }

      const requestData = req.body.data; // base64 закодований JSON
      const requestSignature = req.body.signature;

      if (!requestData || !requestSignature) {
        console.error("LiqPay Callback: Missing data or signature in POST body");
        return res.status(400).send("Missing data or signature");
      }

      // Перевірка підпису
      const expectedSignature = crypto
          .createHash("sha1")
          .update(LIQPAY_PRIVATE_KEY.value() + requestData + LIQPAY_PRIVATE_KEY.value())
          .digest("base64");

      if (requestSignature !== expectedSignature) {
        console.error("LiqPay Callback: Invalid signature.");
        return res.status(400).send("Invalid signature");
      }

      let paymentDetails;
      try {
        const jsonString = Buffer.from(requestData, "base64").toString("utf-8");
        paymentDetails = JSON.parse(jsonString);
        console.log("LiqPay Callback: Decoded payment details -", paymentDetails);
      } catch (error) {
        console.error("LiqPay Callback: Error decoding data -", error);
        return res.status(400).send("Error decoding data");
      }

      const liqpayOrderId = paymentDetails.order_id; // Це order_id, який ми згенерували
      const status = paymentDetails.status; // 'success', 'failure', 'sandbox', 'error', 'wait_secure' і т.д.

      if (!liqpayOrderId) {
        console.error("LiqPay Callback: order_id is missing in paymentDetails");
        return res.status(400).send("Missing order_id");
      }

      try {
        const ordersQuery = db.collection("orders").where("liqpayOrderId", "==", liqpayOrderId).limit(1);
        const orderSnapshot = await ordersQuery.get();

        if (orderSnapshot.empty) {
          console.error(`LiqPay Callback: No order found in 'orders' collection for clientGeneratedOrderId: ${liqpayOrderId}`);
          return res.status(200).send("OK (Order not found, but callback received)");
        }

        const orderDoc = orderSnapshot.docs[0];
        const orderData = orderDoc.data();

        await orderDoc.ref.update({
          paymentStatus: status,
          liqpayPaymentId: paymentDetails.payment_id,
          liqpayTransactionId: paymentDetails.transaction_id,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`Order ${orderDoc.id} status updated to ${status} for LiqPay order ${liqpayOrderId}`);

        if (status === "success" || status === "sandbox") {
          const userCourseData = {
            email: orderData.email, // З оригінального замовлення
            phoneNumber: orderData.phoneNumber, // З оригінального замовлення
            courseId: orderData.courseId, // З оригінального замовлення
            courseTitle: orderData.courseTitle, // З оригінального замовлення
            purchaseDate: admin.firestore.FieldValue.serverTimestamp(),
            accessStatus: "granted", // Або інший статус доступу
            liqpayOrderId: liqpayOrderId,
          };
          await db.collection("user_courses").add(userCourseData);
          console.log(`Access granted for course ${orderData.courseId} to user ${orderData.telegramUsername}`);
        }

        return res.status(200).send("OK");
      } catch (error) {
        console.error(`LiqPay Callback: Error processing order ${liqpayOrderId}:`, error);
        return res.status(200).send("OK (with internal processing error)");
      }
    });

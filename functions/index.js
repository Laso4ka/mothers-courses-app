const functions = require("firebase-functions");
const cors = require("cors")({origin: true});
const crypto = require("crypto");
const {defineString} = require("firebase-functions/params");

const LIQPAY_PUBLIC_KEY = defineString("LIQPAY_PUBLIC_KEY");
const LIQPAY_PRIVATE_KEY = defineString("LIQPAY_PRIVATE_KEY");

exports.createLiqpayData = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const course = req.body.course;

    if (!course || !course.id || !course.title || !course.price) {
      return res.status(400).send({error: "Missing course data"});
    }

    const payload = {
      version: "3",
      public_key: LIQPAY_PUBLIC_KEY.value(),
      action: "pay",
      amount: course.price.toFixed(2),
      currency: "UAH",
      description: `Оплата курсу: ${course.title}`,
      order_id: `course-${course.id}-${Date.now()}`,
      result_url: "https://your-site.web.app/payment-success",
      server_url: "https://your-cloud-function-url/liqpay-callback",
    };

    const data = Buffer.from(JSON.stringify(payload)).toString("base64");
    const signature = crypto
        .createHash("sha1")
        .update(LIQPAY_PRIVATE_KEY.value() + data + LIQPAY_PRIVATE_KEY.value())
        .digest("base64");

    return res.status(200).json({data, signature});
  });
});

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function formatPrice(price, currency = "INR") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(price);
}


export async function sendPriceDropAlert(
  userEmail,
  product,
  oldPrice,
  newPrice
) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY");
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      throw new Error("Missing RESEND_FROM_EMAIL");
    }


    if (!userEmail || !product?.url) {
      throw new Error("Invalid email or product data");
    }


    const priceDrop = oldPrice - newPrice;

    const percentageDrop =
      oldPrice > 0
        ? ((priceDrop / oldPrice) * 100).toFixed(1)
        : 0;


    const productName =
      product.productName ||
      product.name ||
      "Your tracked product";


    const { data, error } = await resend.emails.send({

      from: process.env.RESEND_FROM_EMAIL,

      to: userEmail,

      subject: `🔥 Price dropped: ${productName}`,

      html: `
      <div style="
        font-family:Arial,sans-serif;
        max-width:600px;
        margin:auto;
        padding:24px;
        border:1px solid #e5e7eb;
        border-radius:16px;
      ">

        <h1 style="
          color:#111827;
          font-size:24px;
        ">
          Price Drop Alert 🚀
        </h1>


        <p style="
          color:#4b5563;
          font-size:16px;
        ">
          The price of <strong>${productName}</strong> has dropped!
        </p>


        <div style="
          background:#f0fdf4;
          padding:16px;
          border-radius:12px;
          margin:20px 0;
        ">

          <p>
            Previous price:
            <strong>
              ${formatPrice(oldPrice, product.currency)}
            </strong>
          </p>


          <p>
            New price:
            <strong style="color:#16a34a;">
              ${formatPrice(newPrice, product.currency)}
            </strong>
          </p>


          <p style="
            color:#16a34a;
            font-weight:bold;
          ">
            You saved ${formatPrice(priceDrop, product.currency)}
            (${percentageDrop}%)
          </p>

        </div>


        <a
          href="${product.url}"
          style="
            display:inline-block;
            background:#f97316;
            color:white;
            padding:12px 20px;
            border-radius:10px;
            text-decoration:none;
            font-weight:bold;
          "
        >
          View Product
        </a>


        <p style="
          margin-top:24px;
          font-size:12px;
          color:#9ca3af;
        ">
          You received this alert because you are tracking this product.
        </p>

      </div>
      `,
    });


    if (error) {
      console.error("Resend error:", error);

      return {
        success: false,
        error,
      };
    }


    return {
      success: true,
      data,
    };


  } catch (error) {

    console.error(
      "Price drop email failed:",
      error
    );

    return {
      success:false,
      error:error.message,
    };

  }
}
export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  
  type RazorpayCheckoutParams = {
    bookingId: string;
    orderId: string;
    amount: number; // in rupees
    user: { name: string; email: string; phone: string };
  };
  
  interface RazorpayPaymentResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }
  
  interface RazorpayOptions {
    key: string | undefined;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayPaymentResponse) => void;
    prefill: {
      name: string;
      email: string;
      contact: string;
    };
    theme: {
      color: string;
    };
  }
  
  declare global {
    interface Window {
      Razorpay: {
        new (options: RazorpayOptions): {
          open(): void;
        };
      };
    }
  }
  
  export const openRazorpayCheckout = async ({
    bookingId,
    orderId,
    amount,
    user,
  }: RazorpayCheckoutParams) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Razorpay failed to load. Check your internet connection.");
      return;
    }
  
    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amount * 100, // paise
      currency: "INR",
      name: "Your App Name",
      description: "Seminar Booking",
      order_id: orderId,
      handler: async function (response: RazorpayPaymentResponse) {
        const res = await fetch("/api/verify-payment", {
          method: "POST",
          body: JSON.stringify({
            bookingId,
            ...response, // contains razorpay_payment_id, razorpay_order_id, razorpay_signature
          }),
        });
  
        const data = await res.json();
        if (data.success) {
          alert("Payment successful!");
          // redirect or update UI
        } else {
          alert("Payment verification failed.");
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone,
      },
      theme: {
        color: "#3399cc",
      },
    };
  
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };
  
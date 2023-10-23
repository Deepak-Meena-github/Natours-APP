/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_51O3ySwSDMZLpvXIe9P7OVRMnZThVfTHjHT5iGv31f6esf0vdRt33MMawPxqGdqRHEXnJiAQ4bdK8FRHE0C2SHnqs00zG1ld7y4');

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
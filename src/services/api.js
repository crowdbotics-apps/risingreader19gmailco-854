import axios from 'axios';
import { FIREBASE_FUNCTION } from '../constant/';

const charge = async (token, amount, currency) => {
  try {
    const res = await axios(FIREBASE_FUNCTION, {
      method: 'POST',
      body: JSON.stringify({
        token,
        charge: {
          amount,
          currency
        }
      })
    });

    const data = await res.json();
    data.body = JSON.parse(data.body);
    return data;
  } catch (error) {
    throw error;
  }

  // return '';
};

export default {
  charge
};

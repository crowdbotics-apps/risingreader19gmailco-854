import firebase from 'react-native-firebase';
import uuid from 'uuid';

const auth = firebase.auth();
const store = firebase.firestore();


const updateGoal = async (payload) => {
  try {

    //console.error(payload.id)
    let ref = store.collection('goals').doc(payload.id);
    await ref.update({
      //id: id,
      number: payload.number,
      segGoal: payload.segGoal,
      //segTime: payload.segTime,
      start: payload.start,
      end: payload.end,
      value: payload.value,
      //uid: auth.currentUser.uid,
      //status: 1
    });

  } catch (error) {
    throw error;
  }
};

const createGoal = async (payload) => {
  try {
    
    const id = uuid();
    let ref = store.collection('goals').doc(id);
    await store.runTransaction(async (transaction) => {
      const doc = await transaction.get(ref);

      if (!doc.exists) {
        transaction.set(ref, {
          id: id,
          number: payload.number,
          value: 0,
          segGoal: payload.segGoal,
          segTime: payload.segTime,
          start: payload.start,
          end: payload.end,
          uid: payload.uid,
          status: 1
        });
      }
      return;

    });
    return;
  } catch (error) {
    throw error;
  }
};

const getUser = async (uid) => {
  try {
    let ref = store.collection('users').doc(uid);
    const userDoc = await ref.get();
    const userData = userDoc.data();
    
    return userData;
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (uid) => {
  try {
    //only master can delete associated user

    let ref = store.collection('users').doc(uid);

    await store.runTransaction(async (transaction) => {
      const doc = await transaction.get(ref);

      if (doc.exists) {
        transaction.update(ref, {
          status: 0
        });
      }
    });
  } catch (error) {
    throw error;
  }
};



export default {
  createGoal,
  updateGoal
};

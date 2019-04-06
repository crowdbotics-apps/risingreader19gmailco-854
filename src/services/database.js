import firebase from 'react-native-firebase';
import uuid from 'uuid';
import moment from 'moment';

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
      value: payload.value
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

const createPlan = async (payload) => {
  try {
    const id = uuid();
    let ref = store.collection('plans').doc(id);
    await store.runTransaction(async (transaction) => {
      const doc = await transaction.get(ref);

      if (!doc.exists) {
        transaction.set(ref, {
          id: id,
          //goalId: payload.goalId,
          //masterId: payload.masterId,
          segGoal: payload.segGoal,
          uid: payload.uid,
          //start: payload.start,
          //end: payload.end,
          tasks: payload.tasks,
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

const generatePlan = async ({
  number,
  age,
  segGoal,
  segTime,
  start,
  end,
  uid,
  goalId,
  count
}) => {
  try {
    let tasks = [];

    const momentStart = moment(start);
    const momentEnd = moment(end);
    let duration = moment.duration(momentEnd.diff(momentStart)).as('d');

    //let count = 4 //depends on child age 8-12: 4, 4-8: 8
    const x = parseInt(age);
    // switch(true){
    //   case (x <= 8):
    //     count = 12
    //     break
    //   case (x <= 12 ):
    //     count = 8
    //     break
    //   default:
    //     count = 4
    //     break
    // }
    //console.error(count, age)
    const interval = Math.floor(duration / count);

    //monthly
    if (segTime == 1) {
      for (i = 1; i <= count; i++) {
        tasks.push({
          end:
            i == count
              ? end
              : moment(start)
                  .add(interval * i, 'd')
                  .format(),
          //id: uuid(),
          start:
            i == 1
              ? start
              : moment(start)
                  .add(interval * (i - 1), 'd')
                  .format(),
          task: 'week ' + i,
          number:
            i != 1
              ? Math.floor(number / count)
              : Math.floor(number / count) + (number % count),
          id: i
        });
      }

      await createPlan({
        goalId: goalId,
        //masterId: masterId,
        segGoal: segGoal,
        uid: uid,
        tasks: [...tasks],
        goalId: goalId
      });
    }
  } catch (error) {
    throw error;
  }
};

export default {
  createGoal,
  updateGoal,
  generatePlan
};

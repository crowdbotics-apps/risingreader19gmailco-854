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

    //TODO: delete image
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

const updateBook = async (payload) => {
  try {
    //console.error(payload.id)
    let ref = store.collection('books').doc(payload.id);
    const bookDoc = await ref.get();
    const book = bookDoc.data();

    await ref.update({
      // id: id,
      // uid: payload.uid,
      // masterId: payload.masterId,
      title: payload.title ? payload.title : book.title,
      author: payload.author ? payload.author : book.author,
      pages: payload.pages ? payload.pages : book.pages,
      read: payload.read ? payload.read : book.read,
      uri: payload.uri ? payload.uri : book.uri,
      filename: payload.filename ? payload.filename : book.filename,
      duration: payload.duration
        ? payload.duration + book.duration
        : book.duration,
      status: 1
    });
  } catch (error) {
    throw error;
  }
};

const createBook = async (payload) => {
  try {
    const id = payload.id;
    let ref = store.collection('books').doc(id);
    await store.runTransaction(async (transaction) => {
      const doc = await transaction.get(ref);

      if (!doc.exists) {
        transaction.set(ref, {
          id: id,
          uid: payload.uid,
          masterId: payload.masterId,
          title: payload.title,
          author: payload.author,
          pages: payload.pages,
          read: payload.read,
          duration: 0,
          uri: payload.uri,
          filename: payload.filename,
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

const deleteBook = async (id) => {
  try {
    //only master can delete associated user

    let ref = store.collection('books').doc(id);

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

const getBook = async (uid) => {
  try {
    let ref = await store
      .collection('books')
      .doc(uid)
      .get();

    const book = ref.data();

    return book;
  } catch (error) {
    throw error;
  }
};

const getStats = async () => {
  try {
    let ref = firebase
      .firestore()
      .collection('stats')
      .where('uid', '==', auth.currentUser.uid);

    const QuerySnapshot = await ref.get();
    //console.error(QuerySnapshot.docs[0].data())
    if (QuerySnapshot.docs.length > 0) {
      const item = QuerySnapshot.docs[0].data();

      return item;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export default {
  createGoal,
  updateGoal,

  createBook,
  updateBook,
  deleteBook,
  getBook,

  generatePlan,
  getStats
};

import firebase from 'react-native-firebase';
import uuid from 'uuid';
import moment from 'moment';
import { ACHIEVEMENTS } from '../constant';

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
    let ref = store.collection('books').doc(payload.id);
    const bookDoc = await ref.get();
    const book = bookDoc.data();

    const updBook = {
      ...book,
      title: payload.title ? payload.title : book.title,
      author: payload.author ? payload.author : book.author,
      pages: payload.pages ? payload.pages : book.pages,
      read: payload.read ? payload.read + parseInt(book.read) : book.read,
      uri: payload.uri ? payload.uri : book.uri,
      filename: payload.filename ? payload.filename : book.filename,
      duration: payload.duration
        ? payload.duration + parseInt(book.duration)
        : book.duration,
      status: 1,
      completed: false
    };

    if (updBook.read >= updBook.pages) updBook.completed = true;

    await ref.update(updBook);

    return updBook;
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

const createAchievement = async ({ aId, childId }) => {
  try {
    const id = uuid();
    let ref = store.collection('users_achievements').doc(id);
    await store.runTransaction(async (transaction) => {
      const doc = await transaction.get(ref);

      if (!doc.exists) {
        transaction.set(ref, {
          id: id,
          uid: childId,
          aId: aId,
          date: moment().format()
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

const updateOthers = async ({ childId, page, interval, book }) => {
  try {
    //UPDATE STATS
    let refStats = firebase
      .firestore()
      .collection('stats')
      .where('uid', '==', auth.currentUser.uid);

    let childPageRead = 0;
    let childTotalTime = 0;
    let childBookNo = 0;

    let querySnapshot = await refStats.get();
    if (querySnapshot && querySnapshot.docs.length > 0) {
      const item = querySnapshot.docs[0].data();
      const doc = querySnapshot.docs[0].ref;
      childPageRead = item['pageRead_' + childId]
        ? item['pageRead_' + childId] + page
        : page;
      childBookNo = item['bookNo_' + childId]
        ? item['bookNo_' + childId] + book
        : book;
      childTotalTime = item['totalTime_' + childId]
        ? item['totalTime_' + childId] + interval
        : interval;

      doc.update({
        bestPages: page > item.bestPages ? page : item.bestPages,
        bestTime: interval > item.bestTime ? interval : item.bestTime,
        bookNo: item.bookNo + book,
        longStreak: 0, //Todo:
        pageRead: item.pageRead + page,
        speedRead: 0,
        totalTime: item.totalTime + interval,
        ['pageRead_' + childId]: childPageRead,
        ['bookNo_' + childId]: childBookNo,
        ['totalTime_' + childId]: childTotalTime,
        year: '2019' //Todo:
      });
    } else {
      const ref = firebase
        .firestore()
        .collection('stats')
        .doc(auth.currentUser.uid);

      childPageRead = page;
      childBookNo = book;
      childTotalTime = interval;

      ref.set({
        bestPages: page,
        bestTime: interval,
        bookNo: book,
        longStreak: 0, //Todo:
        pageRead: page,
        speedRead: 0,
        totalTime: interval,
        ['pageRead_' + childId]: childPageRead,
        ['bookNo_' + childId]: childBookNo,
        ['totalTime_' + childId]: childTotalTime,
        year: '2019',
        uid: auth.currentUser.uid
      });
    }

    //UPDATE USERS
    let refUser = firebase
      .firestore()
      .collection('users')
      .doc(childId);

    const ssUser = await refUser.get();
    let userPageRead = 0;
    let userTotalTime = 0;
    let userBookNo = 0;

    if (ssUser.exists) {
      const user = ssUser.data();

      userPageRead = user.pageRead ? user.pageRead + page : page;
      userBookNo = user.bookNo ? user.bookNo + book : book;
      userTotalTime = user.totalTime ? user.totalTime + interval : interval;

      refUser.update({
        pageRead: userPageRead,
        totalTime: userTotalTime,
        bookNo: userBookNo
      });
    }

    //UPDATE GOALS (MONTH and YEAR)
    let refGoal = firebase
      .firestore()
      .collection('goals')
      .where('uid', '==', auth.currentUser.uid)
      .where('status', '==', 1);

    querySnapshot = await refGoal.get();
    querySnapshot &&
      querySnapshot.forEach((docSS) => {
        const item = docSS.data();
        const doc = docSS.ref;
        const updGoal = {
          value: item.segGoal === 2 ? item.value + page : item.value + interval,
          status: item.status,
          end: item.end,
          number: item.number
        };
        if (item.segGoal === 2 && updGoal.number <= updGoal.value) {
          updGoal.status = 2;
          updGoal.end = moment().format();
        }
        if (item.segGoal === 1 && updGoal.number * 3600 <= updGoal.value) {
          updGoal.status = 2;
          updGoal.end = moment().format();
        }

        doc.update(updGoal);
      });

    //UPDATE READING PLANS
    let refPlans = firebase
      .firestore()
      .collection('plans')
      .where('uid', '==', auth.currentUser.uid)
      .where('status', '==', 1);
    querySnapshot = await refPlans.get();
    querySnapshot &&
      querySnapshot.forEach((docSS) => {
        const item = docSS.data();
        const doc = docSS.ref;

        const { tasks, segGoal } = item;

        const lst = tasks.filter(
          (item) => item[childId] != null && item[childId] != item.number
        );

        if (lst && lst[0]) {
          const task = lst[0];
          let value = 0;
          if (task[childId])
            value =
              segGoal === 2 ? task[childId] + page : task[childId] + interval;
          else value = segGoal === 2 ? page : interval;

          if (value > task.number) value = task.number;
          //Todo: move left over to next task
          // console.error(value);
          const updTask = {
            ...task,
            [childId]: value
          };

          doc.update({
            tasks: [...tasks.filter((item) => item.id !== updTask.id), updTask]
          });
        } else {
          const lst = tasks.filter((item) => item[childId] == null);

          if (lst && lst[0]) {
            const min = 0;
            for (i = 0; i < lst.length - 1; i++)
              for (j = 0; j < lst.length; j++)
                if (lst[min].id > lst[j].id) min = j;

            const task = lst[min];
            let value = segGoal === 2 ? page : interval;

            if (segGoal === 2 && value > task.number) value = task.number;
            if (segGoal === 1 && value > task.number * 3600)
              value = task.number;

            //Todo: move left over to next task
            const updTask = {
              ...task,
              [childId]: value
            };
            doc.update({
              tasks: [
                ...tasks.filter((item) => item.id !== updTask.id),
                updTask
              ]
            });
          }
        }
      });

    //UPDATE ACHIEVEMENTS
    const childAchievements = [];
    let refAchieve = firebase
      .firestore()
      .collection('users_achievements')
      .where('uid', '==', childId);
    querySnapshot = await refAchieve.get();
    querySnapshot &&
      querySnapshot.forEach((docSS) => {
        const item = docSS.data();
        // const doc = docSS.ref;
        childAchievements.push(item);
      });

    const newChildAchieve = [];
    ACHIEVEMENTS.forEach((row) => {
      row.forEach((item) => {
        const existed = childAchievements.find((e) => e.aId === item.id);
        if (!existed) {
          switch (item.seg) {
            case 1: //hour
              if (item.value * 3600 < userTotalTime) {
                createAchievement({ aId: item.id, childId });
                newChildAchieve.push(item);
              }

              break;
            case 2: //page
              if (item.value < userPageRead) {
                createAchievement({ aId: item.id, childId });
                newChildAchieve.push(item);
              }
            case 3: //book
              if (item.value < userBookNo) {
                createAchievement({ aId: item.id, childId });
                newChildAchieve.push(item);
              }
          }
        }
      });
    });

    return newChildAchieve;
  } catch (error) {
    throw error;
  }
};

const getChildAchievements = async (childId) => {
  try {
    const childAchievements = [];
    let refAchieve = firebase
      .firestore()
      .collection('users_achievements')
      .where('uid', '==', childId);
    querySnapshot = await refAchieve.get();
    querySnapshot &&
      querySnapshot.forEach((docSS) => {
        const item = docSS.data();
        // const doc = docSS.ref;
        childAchievements.push(item);
      });
    return childAchievements;
  } catch (error) {
    throw error.message;
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
  getStats,

  updateOthers,
  getChildAchievements
};

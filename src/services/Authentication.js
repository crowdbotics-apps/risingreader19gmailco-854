import firebase from 'react-native-firebase';
import uuid from 'uuid';

const auth = firebase.auth();
const store = firebase.firestore();

const signup = async (payload) => {
  try {
    let user = await auth.createUserWithEmailAndPassword(
      payload.email,
      payload.password
    );
    await user.user.sendEmailVerification({
      ios: {
        bundleId: 'com.crowdbotics.risingreaders'
      },
      android: {
        packageName: 'com.crowdbotics.risingreaders'
      }
    });
    await user.user.updateProfile({
      displayName: payload.name
    });

    let ref = store.collection('users').doc(user.user.uid);
    await store.runTransaction(async (transaction) => {
      const doc = await transaction.get(ref);

      if (!doc.exists) {
        transaction.set(ref, {
          id: user.user.uid,
          name: payload.name,
          email: payload.email,
          password: payload.password,
          age: '',
          child: false,
          masterId: '',
          status: 1
        });
      }
      return user;
    });
    return user;
  } catch (error) {
    throw error;
  }
};

const sendEmailVerification = async () => {
  try {
    await auth.currentUser.sendEmailVerification({
      ios: {
        bundleId: 'com.crowdbotics.risingreaders'
      },
      android: {
        packageName: 'com.crowdbotics.risingreaders'
      }
    });
  } catch (error) {
    throw error;
  }
};

const login = async (payload) => {
  try {
    let { email, password } = payload;
    let user = await auth.signInWithEmailAndPassword(email, password);
    return user;
  } catch (error) {
    throw error;
  }
};

const logout = async () => {
  try {
    //TODO:
     // await auth.signOut();
 
      
  } catch (error) {
    throw error;
  }
};

const updateUser = async ({
  uid,
  displayName,
  password,
  email,
  age,
  child,
  masterId,
  dob
}) => {
  try {
    if (auth.currentUser.uid === uid) {
      await auth.currentUser.updateProfile({
        displayName: displayName
      });
      if (password) {
        await auth.currentUser.updatePassword(password);
      }
    }

    let ref = store.collection('users').doc(uid);
    await ref.update({
      name: displayName,
      age: age,
      child: child,
      password: password,
      dob: dob,
    });

  } catch (error) {
    throw error;
  }
};

const createUser = async (payload) => {
  try {
    // let user = await auth.createUserWithEmailAndPassword(
    //   payload.email,
    //   payload.password
    // );

    // await user.user.sendEmailVerification({
    //   ios: {
    //     bundleId: 'com.crowdbotics.risingreaders'
    //   },
    //   android: {
    //     packageName: 'com.crowdbotics.risingreaders'
    //   }
    // });

    // await user.user.updateProfile({
    //   displayName: payload.name
    // });
    const uid = uuid();
    let ref = store.collection('users').doc(uid);
    await store.runTransaction(async (transaction) => {
      const doc = await transaction.get(ref);

      if (!doc.exists) {
        transaction.set(ref, {
          id: uid,
          name: payload.name,
          email: payload.email,
          password: payload.password,
          age: payload.age,
          child: payload.child,
          masterId: payload.masterId,
          status: 1,
          dob: payload.dob,
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

const forgotPassword = async (email) => {
  try {
    await auth.sendPasswordResetEmail(email);
  } catch (error) {
    throw error;
  }
};

export default {
  signup,
  login,
  logout,
  updateUser,
  sendEmailVerification,
  forgotPassword,
  createUser,
  deleteUser,
  getUser
};

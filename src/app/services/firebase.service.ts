import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  addDoc,
  collection,
  query,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { collectionData } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  utilSvc = inject(UtilsService);

  //=== AUTENTICACION ===//

  getAuth() {
    return getAuth();
  }

  //=== INGRESAR ===//
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //=== REGISTRAR ===//
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }
  //=== ACTUALIZAR ===//
  updateProfile(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  //=== RECUPERAR CONTRASEÑA ===//
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  //=== CERRAR SESION ===//
 async signOut() {
  await getAuth().signOut();
  localStorage.removeItem('user');
  this.utilSvc.routerLink('/auth');
}

  //=== BASE DE DATOS ===//

  //===GET DOCUMENT COLLECTION===//
  getCollectionData(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref,collectionQuery), { idField: 'id' });
  }

  //===SET DOCUMENTO===//
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  //===UPDATE DOCUMENTO===//
  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  //===DELETE DOCUMENTO===//
  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path));
  }

  //===GET DOCUMENTO===//
  async getDocument(path: string) {
    const snapshot = await getDoc(doc(getFirestore(), path));
    return snapshot.exists() ? snapshot.data() : null;
  }

  //===AGREGAR DOCUMENTO===//
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  //===ALMACENAMIENTO ===//

  //===SUBIR IMAGEN===//
  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url')
    .then (() => {
      return getDownloadURL(ref(getStorage(), path));
    });
  }

  //===GET FILE PATH===//
  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath;
  }

  //=== DELETE FILE STORAGE ===//
  async deleteFile(path: string) {
    return deleteObject(ref(getStorage(), path));
  }
}

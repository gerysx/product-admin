import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  AlertOptions,
  LoadingController,
  ModalController,
  ModalOptions,
  ToastController,
  ToastOptions,
} from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtrl = inject(ModalController);
  router = inject(Router);
  alertCtrl = inject(AlertController)

 /*  async takePicture(promptLabelHeader: string) {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto: 'Selecciona una imagen',
      promptLabelPicture: 'Toma una foto',
    });
  } */

    async takePicture(promptLabelHeader: string) {
  const isWeb = Capacitor.getPlatform() === 'web';

  return await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.DataUrl,
    source: isWeb ? CameraSource.Camera : CameraSource.Prompt,
    ...(isWeb ? {} : {
      promptLabelHeader,
      promptLabelPhoto: 'Selecciona una imagen',
      promptLabelPicture: 'Toma una foto'
    })
  });
}

//=== ALERT ===//
  async presentAlert(opts: AlertOptions) {
    const alert = await this.alertCtrl.create(opts);
    await alert.present();

  }

  //=== LOADING ===//

  loading(message: string = 'Cargando...') {
  return this.loadingCtrl.create({
    spinner: 'crescent',
    message
  });
}

  //=== TOAST ===//
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  //=== ENRUTA A CUALQUIER PAGINA DISPONIBLE ===//
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  //=== GUARDA UNA ELEMENTO EN EL LOCAL STORAGE ===//
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  //==OBTENER UNA ELEMENTO DEL LOCAL STORAGE ===//
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  //==MODAL ===//
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) return data;
  }

  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data);
  }
}

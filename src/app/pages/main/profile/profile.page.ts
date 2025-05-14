import { Component, inject, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {}

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  async takeImage() {
    let loading;
    try {
      let user = this.user();
      let path = `users/${user.uid}`;
      const dataUrl = (await this.utilsSvc.takePicture('Imagen del perfil')).dataUrl;

       loading = await this.utilsSvc.loading();
      await loading.present();


      let imagePath = `${user.uid}/profile`;
      user.image = await this.firebaseSvc.uploadImage(imagePath, dataUrl);

      await this.firebaseSvc.updateDocument(path, { image: user.image });
      this.utilsSvc.saveInLocalStorage('user', user);

      this.utilsSvc.presentToast({
        message: 'Imagen actualizada exitosamente',
        duration: 1500,
        color: 'success',
        position: 'bottom',
        icon: 'checkmark-circle-outline',
      });

    } catch (err) {
      console.error('Error al actualizar la imagen de perfil:', err);
      this.utilsSvc.presentToast({
        message: 'Error al actualizar el producto',
        duration: 2000,
        color: 'danger',
        position: 'bottom',
        icon: 'alert-circle-outline',
      });
    } finally {
      loading?.dismiss();
    }
  }
}

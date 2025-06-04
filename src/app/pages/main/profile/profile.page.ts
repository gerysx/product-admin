import { Component, inject, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';
import { EditProfileComponent } from './edit-profile.component';
import { TermsModalComponent } from './terms/terms-modal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  router = inject(Router);

  user: User = null;

  ngOnInit() {
    const userData = this.utilsSvc.getFromLocalStorage('user');
    if (!userData) {
      this.router.navigateByUrl('/auth');
    }
    this.user = userData;
  }

  async takeImage() {
    let loading;
    try {
      const dataUrl = (await this.utilsSvc.takePicture('Actualizar foto de perfil')).dataUrl;

      loading = await this.utilsSvc.loading('Subiendo imagen...');
      await loading.present();

      const imagePath = `${this.user.uid}/profile`;
      this.user.image = await this.firebaseSvc.uploadImage(imagePath, dataUrl);

      await this.firebaseSvc.updateDocument(`users/${this.user.uid}`, { image: this.user.image });
      this.utilsSvc.saveInLocalStorage('user', this.user);

      this.utilsSvc.presentToast({
        message: 'Imagen de perfil actualizada',
        duration: 1500,
        color: 'success',
        icon: 'checkmark-circle-outline',
      });
    } catch (err) {
      console.error('Error al actualizar imagen:', err);
      this.utilsSvc.presentToast({
        message: 'No se pudo actualizar la imagen',
        color: 'danger',
      });
    } finally {
      loading?.dismiss();
    }
  }

 async editProfile() {
  const success = await this.utilsSvc.presentModal({
    component: EditProfileComponent,
    cssClass: 'edit-profile-modal',
  });
  if (success) {
    this.user = this.utilsSvc.getFromLocalStorage('user'); // Actualiza la vista
  }
}
  viewTerms() {
    this.utilsSvc.presentToast({ message: 'Términos y condiciones aún no disponibles' });
  }

  async logout() {
    await this.firebaseSvc.signOut();
  }

  openTerms() {
  this.utilsSvc.presentModal({
    component: TermsModalComponent,
    cssClass: 'terms-modal'
  });
}
}

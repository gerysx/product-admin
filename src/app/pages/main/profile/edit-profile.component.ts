import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { getAuth, updatePassword } from 'firebase/auth';

@Component({
  selector: 'app-edit-profile',
  standalone: false,
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {
  modalCtrl = inject(ModalController);
  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);
  fb = inject(FormBuilder);

  form: FormGroup;

  constructor() {
    const user = this.utilsSvc.getFromLocalStorage('user');
    this.form = this.fb.group({
      name: [user.name, [Validators.required, Validators.minLength(3)]],
      password: [''],
      confirmPassword: [''],
    });
  }

  async save() {
    const user = this.utilsSvc.getFromLocalStorage('user');
    const uid = user.uid;
    const name = this.form.value.name?.trim();
    const password = this.form.value.password?.trim();
    const confirmPassword = this.form.value.confirmPassword?.trim();

    if (password && password !== confirmPassword) {
      this.utilsSvc.presentToast({ message: 'Las contraseñas no coinciden', color: 'danger' });
      return;
    }

    const loading = await this.utilsSvc.loading('Guardando cambios...');
    await loading.present();

    try {
      // 🔁 Actualizar nombre en Firestore
      await this.firebaseSvc.updateDocument(`users/${uid}`, { name });
      user.name = name;
      this.utilsSvc.saveInLocalStorage('user', user);

      // 🔐 Si hay nueva contraseña, actualizarla en Auth
      if (password) {
        const authUser = getAuth().currentUser;
        await updatePassword(authUser, password);
      }

      this.utilsSvc.presentToast({
        message: 'Perfil actualizado correctamente',
        color: 'success',
        duration: 1500,
      });

      this.modalCtrl.dismiss(true);
    } catch (err) {
      console.error('Error actualizando perfil:', err);
      this.utilsSvc.presentToast({ message: 'Error al guardar cambios', color: 'danger' });
    } finally {
      loading.dismiss();
    }
  }

  close() {
    this.modalCtrl.dismiss(false);
  }
}

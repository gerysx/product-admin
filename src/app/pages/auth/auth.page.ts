import { User } from './../../models/user.model';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: false,
})
export class AuthPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {}
  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc
        .signIn(this.form.value as User)
        .then((res) => {
          this.getUserInfo(res.user.uid);
        })
        .catch((err) => {
          console.log(err);

          this.utilsSvc.presentToast({
            message: 'Error al iniciar sesión',
            duration: 2000,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }

  async getUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      const path = `users/${uid}`;

      this.firebaseSvc
        .getDocument(path)
        .then((userData) => {
          if (!userData) {
            throw new Error('Usuario no encontrado en la base de datos');
          }

          const user = userData as User;

          this.utilsSvc.saveInLocalStorage('user', user);
          this.utilsSvc.routerLink('/main/home');
          this.form.reset();

          this.utilsSvc.presentToast({
            message: `Te damos la bienvenida ${user.name}`,
            duration: 1500,
            color: 'primary',
            position: 'bottom',
            icon: 'person-circle-outline',
          });
        })
        .catch((err) => {
          console.log(err);

          this.utilsSvc.presentToast({
            message: 'Error al iniciar sesión',
            duration: 2000,
            color: 'danger',
            position: 'bottom',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }
}

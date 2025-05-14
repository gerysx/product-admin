import { Component, inject, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import { orderBy, where } from 'firebase/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  products: Product[] = [];
  loading: boolean = false;

  ngOnInit() {}

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }
  ionViewWillEnter() {
    this.getProducts();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getProducts();
      event.target.complete();
    }, 1000);
  }

  //=== OBTENER GANANCIA ===//
  getProfits(){
    return this.products.reduce((index, product) => index + product.soldUnits * product.price, 0);
  }

  //=== OBTENER PRODUCTOS ===//
  getProducts() {
    let path = `users/${this.user().uid}/products`;
    this.loading = true;

    let query = [
      orderBy('soldUnits', 'desc'),
      //where('soldUnits', '>', 30),

    ]


    let sub = this.firebaseSvc.getCollectionData(path, orderBy('soldUnits', 'desc')).subscribe({
      next: (res: any) => {
        console.log(res);
        this.products = res;
        this.loading = false;
        sub.unsubscribe();
      },
    });
  }

  //=== AGREGAR O ACTUALIZAR PRODUCTO ===//
  async addUpdateProduct(product?: Product) {
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: {product}
    });
    if (success) this.getProducts();

  }

  //=== ELIMINAR PRODUCTO ===//
  async deleteProduct(product: Product) {
    let path = `users/${this.user().uid}/products/${product.id}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath = await this.firebaseSvc.getFilePath(product.image);
    await this.firebaseSvc.deleteDocument(imagePath);

    this.firebaseSvc
      .deleteDocument(path)
      .then(async (res) => {

        this.products = this.products.filter((p) => p.id !== product.id);

        this.utilsSvc.presentToast({
          message: 'Producto eliminado exitosamente',
          duration: 1500,
          color: 'success',
          position: 'bottom',
          icon: 'checkmark-circle-outline',
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

  async confirmDeleteProduct(product: Product) {
   this.utilsSvc.presentAlert({
      header: 'Eliminar producto!',
      message: '¿Estás seguro que quieres eliminar producto?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        }, {
          text: 'Sí, eliminar',
          handler: () => {
            this.deleteProduct(product);
          }
        }
      ]
    });
  }
}

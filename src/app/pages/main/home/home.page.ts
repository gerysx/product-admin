import { Component, inject, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import { orderBy } from 'firebase/firestore';

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
  loading = false;

  ngOnInit() {}

  ionViewWillEnter() {
    this.getProducts();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getProducts();
      event.target.complete();
    }, 1000);
  }

  //=== GANANCIA TOTAL ===//
  getProfits() {
    return this.products.reduce((total, p) => total + p.soldUnits * p.price, 0);
  }

  //=== OBTENER PRODUCTOS ===//
  getProducts() {
    const uid = this.utilsSvc.getSafeUid();
    if (!uid) return;

    const path = `users/${uid}/products`;
    this.loading = true;

    const sub = this.firebaseSvc
      .getCollectionData(path, orderBy('soldUnits', 'desc'))
      .subscribe({
        next: (res: any) => {
          this.products = res;
          this.loading = false;
          sub.unsubscribe();
        },
        error: (err) => {
          console.error('❌ Error al cargar productos:', err);
          this.loading = false;
          this.utilsSvc.presentToast({
            message: 'Error al cargar productos',
            color: 'danger',
            duration: 2000,
          });
        },
      });
  }

  //=== AÑADIR / ACTUALIZAR PRODUCTO ===//
  async addUpdateProduct(product?: Product) {
    const success = await this.utilsSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: { product },
    });
    if (success) this.getProducts();
  }

  //=== ELIMINAR PRODUCTO ===//
  async deleteProduct(product: Product) {
  const uid = this.utilsSvc.getSafeUid();
  if (!uid) return;

  const path = `users/${uid}/products/${product.id}`;
  const loading = await this.utilsSvc.loading('Eliminando producto...');
  await loading.present();

  try {
    const imagePath = await this.firebaseSvc.getFilePath(product.image);
    await this.firebaseSvc.deleteFile(imagePath);     // ✅ CORRECTO: eliminar imagen del storage
    await this.firebaseSvc.deleteDocument(path);      // ✅ CORRECTO: eliminar documento de Firestore

    this.products = this.products.filter(p => p.id !== product.id);

    this.utilsSvc.presentToast({
      message: 'Producto eliminado exitosamente',
      duration: 1500,
      color: 'success',
      icon: 'checkmark-circle-outline',
    });
  } catch (err) {
    console.error('❌ Error al eliminar:', err);
    this.utilsSvc.presentToast({
      message: 'Error al eliminar producto',
      duration: 2000,
      color: 'danger',
      icon: 'alert-circle-outline',
    });
  } finally {
    loading.dismiss();
  }
}


  //=== CONFIRMAR ELIMINACIÓN ===//
  async confirmDeleteProduct(product: Product) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar producto',
      message: '¿Estás seguro que deseas eliminar este producto?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Sí, eliminar',
          handler: () => this.deleteProduct(product),
        },
      ],
    });
  }
}

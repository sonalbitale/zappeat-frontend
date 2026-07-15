import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { MenuList } from './features/menu/menu-list/menu-list';
import { CartPage } from './features/cart/cart-page/cart-page';
import { Checkout } from './features/checkout/checkout';
import { Payment } from './features/payment/payment';
import { OrderSuccess } from './features/order-success/order-success';
import { OrderTracking } from './features/order-tracking/order-tracking';
import { VendorSignupComponent } from './features/auth/vendor-signup-component/vendor-signup-component';
import { roleGuard } from './core/guards/role-guard';
import { adminGuard } from './core/guards/admin-guard';
import { VendorDashboard } from './features/dashboard/vendor-dashboard/vendor-dashboard';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { Addfooditem } from './features/dashboard/addfooditem/addfooditem';
import { Vendororders } from './features/dashboard/vendororders/vendororders';
import { DeliveryOrdersComponent } from './features/delivery/delivery-orders-component/delivery-orders-component';
import { DeliverySignup } from './features/auth/register/delivery-signup/delivery-signup';

export const routes: Routes = [
     {path: 'login', component: Login},
     { path: 'register', component: Register },
    //  {path:'getmenu', component: MenuList},
     { path: '', redirectTo: 'menu', pathMatch: 'full' },
     { path: 'menu', component: MenuList },
    //  {path:'cart', redirectTo: 'checkout', pathMatch: 'full'},
     {path:'cart', component:CartPage},
     {path:'checkout', component:Checkout},
     {path:'payment', component:Payment},
     { path: 'order-success', component: OrderSuccess },
     { path: 'order-tracking/:id', component: OrderTracking },
     {path:'vendor-signup', component:VendorSignupComponent},
 //  { path: '', component: MenuComponent },
     { path: 'vendor-dashboard', component: VendorDashboard, canActivate: [roleGuard] },
     { path: 'admin-dashboard', component: AdminDashboard, canActivate: [adminGuard] },
     {path :'vendor/add-food-item',component:Addfooditem,canActivate: [roleGuard]},
     {path :'vendor/edit-food-item/:id',component:Addfooditem, canActivate: [roleGuard]},
     { path: 'vendor/orders', component: Vendororders, canActivate: [roleGuard] },

    //  delivery boy routing
    { path: 'delivery-signup', component: DeliverySignup },

    { path: 'delivery/incomingorders', component: DeliveryOrdersComponent },


     { path: '', redirectTo: 'login',  pathMatch: 'full'  } // default page
];

import { Routes, Route } from '@angular/router';

import { AuthenticationGuard } from '@app/core';
import { OpenGuard } from '@app/core/authentication/open.guard';
import { ShellComponent } from './shell.component';
import { AdminGuard } from '@app/core/authentication/admin.guard';

/**
 * Provides helper methods to create routes.
 */
export class Shell {

  /**
   * Creates routes using the shell component and authentication.
   * @param routes The routes to add.
   * @return The new route using shell as the base.
   */
  static childRoutes(routes: Routes): Route {
    return {
      path: '',
      component: ShellComponent,
      children: routes,
      canActivate: [AuthenticationGuard],
      // Reuse ShellComponent instance when navigating between child views
      data: { reuse: true }
    };
  }

  /**
   * Creates routes using the shell component and without authentication.
   * @param routes The routes to add.
   * @return The new route using shell as the base.
   */
  static childRoutesWithoutAuth(routes: Routes): Route {
    return {
      path: '',
      component: ShellComponent,
      children: routes,
      canActivate: [OpenGuard],
      // Reuse ShellComponent instance when navigating between child views
      data: { reuse: true }
    };
  }

  /**
   * Creates routes using the shell component and authentication for admin.
   * @param routes The routes to add.
   * @return The new route using shell as the base.
   */
  static childRoutesAdminAuth(routes: Routes): Route {
    return {
      path: '',
      component: ShellComponent,
      children: routes,
      canActivate: [AdminGuard],
      // Reuse ShellComponent instance when navigating between child views
      data: { reuse: true }
    };
  }
}

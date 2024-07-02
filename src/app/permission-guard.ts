import { inject } from "@angular/core"
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router"
import { CollectionsService } from "./services/collections.service"

export const collectionsImported: CanActivateFn = () => {
    const collectionsService = inject(CollectionsService)
    const router = inject(Router)
  
    return collectionsService.areCollectionsImported() 
        ? true
        : router.createUrlTree(['/'])
}
  
export const ccollectionsImportedChild: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => collectionsImported(route, state)
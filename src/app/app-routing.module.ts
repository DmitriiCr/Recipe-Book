import { RecipeResolverService } from "./recipes/recipes-resolver.service";
import { RecipeEditComponent } from "./recipes/recipe-edit/recipe-edit.component";
import { RecipeStartComponent } from "./recipes/recipe-start/recipe-start.component";
import { RecipeDetailComponent } from "./recipes/recipe-detail/recipe-detail.component";
import { RecipeItemComponent } from "./recipes/recipe-list/recipe-item/recipe-item.component";
import { AppComponent } from "./app.component";
import { ShoppingListComponent } from "./shopping-list/shopping-list.component";
import { RecipesComponent } from "./recipes/recipes.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const appRoutes: Routes = [
  {
    path: "",
    redirectTo: "/recipes",
    pathMatch: "full",
  },
  {
    path: "recipes",
    component: RecipesComponent,
    children: [
      {
        path: "",
        component: RecipeStartComponent,
      },
      {
        path: "new",
        component: RecipeEditComponent,
      },
      {
        path: ":id",
        resolve: [RecipeResolverService],
        component: RecipeDetailComponent,
      },

      {
        path: ":id/edit",
        resolve: [RecipeResolverService],

        component: RecipeEditComponent,
      },
    ],
  },
  {
    path: "shopping-list",
    component: ShoppingListComponent,
  },
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
